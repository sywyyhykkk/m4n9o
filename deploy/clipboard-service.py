#!/usr/bin/env python3
"""Single shared, temporary clipboard for the M4N9O site."""

import hmac
import json
import os
import threading
import time
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer


TOKEN = os.environ["CLIPBOARD_SERVICE_TOKEN"]
PORT = int(os.environ.get("CLIPBOARD_SERVICE_PORT", "8765"))
LIFETIME_SECONDS = 600
MAX_TEXT_BYTES = 32768

lock = threading.Lock()
text = None
expires_at = 0.0
generation = 0
clear_timer = None


def clear_if_current(expected_generation):
    global text, expires_at
    with lock:
        if generation == expected_generation:
            text = None
            expires_at = 0.0


def current_value():
    global text, expires_at
    with lock:
        if text is not None and time.time() >= expires_at:
            text = None
            expires_at = 0.0
        expiry = (
            datetime.fromtimestamp(expires_at, timezone.utc).isoformat()
            if text is not None
            else None
        )
        return {"text": text, "expiresAt": expiry}


class ClipboardHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

    def respond(self, status, payload):
        data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def authorized(self):
        supplied = self.headers.get("X-Clipboard-Token", "")
        if hmac.compare_digest(supplied, TOKEN):
            return True
        self.respond(401, {"error": "Unauthorized"})
        return False

    def do_GET(self):
        if self.path != "/clipboard":
            self.respond(404, {"error": "Not found"})
        elif self.authorized():
            self.respond(200, current_value())

    def do_POST(self):
        global text, expires_at, generation, clear_timer

        if self.path != "/clipboard":
            self.respond(404, {"error": "Not found"})
            return
        if not self.authorized():
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length < 1 or length > MAX_TEXT_BYTES + 100:
                raise ValueError("Invalid length")
            body = json.loads(self.rfile.read(length))
            next_text = body["text"]
            if not isinstance(next_text, str) or not next_text or len(next_text.encode("utf-8")) > MAX_TEXT_BYTES:
                raise ValueError("Invalid text")
        except (ValueError, KeyError, TypeError, UnicodeDecodeError, json.JSONDecodeError):
            self.respond(400, {"error": "Invalid text"})
            return

        with lock:
            if clear_timer is not None:
                clear_timer.cancel()
            generation += 1
            text = next_text
            expires_at = time.time() + LIFETIME_SECONDS
            clear_timer = threading.Timer(LIFETIME_SECONDS, clear_if_current, args=(generation,))
            clear_timer.daemon = True
            clear_timer.start()

        self.respond(200, current_value())


if __name__ == "__main__":
    ThreadingHTTPServer(("127.0.0.1", PORT), ClipboardHandler).serve_forever()
