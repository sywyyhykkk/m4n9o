<script setup lang="ts">
import { projects } from '~/data/projects'

useSeoMeta({
  title: 'Projects — M4N9O',
  description: 'Projects and open-source work contributed to by Mango.',
  ogTitle: 'Projects — M4N9O',
  ogDescription: 'Projects and open-source work contributed to by Mango.',
})
</script>

<template>
  <main class="projects-page">
    <section class="projects-shell" aria-labelledby="projects-title">
      <TerminalSectionHeader section="project" />

      <div class="projects-intro">
        <p class="projects-eyebrow">
          ./projects
        </p>
        <h1 id="projects-title">
          Projects I’ve contributed to.
        </h1>
        <p>
          A small, growing index of collaborative work and source repositories.
        </p>
      </div>

      <div class="projects-tree" aria-hidden="true">
        <span>projects/</span>
        <span>└── {{ projects.length }} entr{{ projects.length === 1 ? 'y' : 'ies' }}</span>
      </div>

      <ol class="projects-list">
        <li v-for="(project, index) in projects" :key="project.repository">
          <article class="project-card">
            <div class="project-card__index" aria-hidden="true">
              {{ String(index + 1).padStart(2, '0') }}
            </div>

            <div class="project-card__body">
              <div class="project-card__meta">
                <span>{{ project.role }}</span>
                <span>GitHub</span>
              </div>

              <h2>{{ project.name }}</h2>
              <code>{{ project.repository }}</code>
            </div>

            <a
              class="project-card__link"
              :href="project.url"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="`Open ${project.name} on GitHub in a new tab`"
            >
              View repository
              <span aria-hidden="true">↗</span>
            </a>
          </article>
        </li>
      </ol>

      <footer class="projects-footer">
        <span class="projects-footer__status" aria-hidden="true" />
        {{ projects.length }} project{{ projects.length === 1 ? '' : 's' }} indexed
      </footer>
    </section>
  </main>
</template>

<style scoped>
.projects-page {
  min-height: 100dvh;
  padding: clamp(1.25rem, 4vw, 3.5rem);
  background:
    radial-gradient(circle at 50% 0%, rgb(28 76 42 / 0.18), transparent 38rem),
    #000;
  color: #d9ffe4;
}

.projects-shell {
  width: min(100%, 62rem);
  margin: 0 auto;
}

.project-card__link:focus-visible {
  border-radius: 0.2rem;
  outline: 2px solid #45f47b;
  outline-offset: 4px;
}

.projects-intro {
  max-width: 48rem;
  padding: clamp(3rem, 9vw, 7rem) 0 clamp(2.5rem, 6vw, 4.5rem);
}

.projects-eyebrow {
  margin: 0 0 1rem;
  color: #45f47b;
  font-size: 0.875rem;
  letter-spacing: 0.08em;
}

.projects-intro h1 {
  margin: 0;
  color: #ecfff1;
  font-size: clamp(2.3rem, 7vw, 5.5rem);
  font-weight: 560;
  letter-spacing: -0.065em;
  line-height: 0.98;
}

.projects-intro > p:last-child {
  max-width: 37rem;
  margin: 1.5rem 0 0;
  color: #799683;
  font-size: clamp(1rem, 2vw, 1.125rem);
  line-height: 1.7;
}

.projects-tree {
  display: grid;
  gap: 0.3rem;
  margin-bottom: 1rem;
  color: #52735c;
  font-size: 0.8125rem;
  line-height: 1.5;
}

.projects-tree span:last-child {
  padding-left: 1rem;
}

.projects-list {
  display: grid;
  gap: 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.project-card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: clamp(1rem, 3vw, 2rem);
  min-height: 10rem;
  padding: clamp(1.25rem, 3vw, 2rem);
  border: 1px solid #203729;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, rgb(8 17 11 / 0.96), rgb(3 8 5 / 0.96));
  box-shadow: inset 0 1px rgb(255 255 255 / 0.025);
  transition:
    border-color 160ms ease,
    transform 160ms ease,
    box-shadow 160ms ease;
}

.project-card:hover {
  border-color: #376e48;
  transform: translateY(-2px);
  box-shadow:
    inset 0 1px rgb(255 255 255 / 0.04),
    0 1.25rem 3rem rgb(0 0 0 / 0.35);
}

.project-card__index {
  color: #31513a;
  font-size: 0.8125rem;
  align-self: start;
}

.project-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.65rem;
}

.project-card__meta span {
  padding: 0.2rem 0.5rem;
  border: 1px solid #284431;
  border-radius: 999px;
  color: #70917a;
  font-size: 0.75rem;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.project-card h2 {
  margin: 0;
  color: #d9ffe4;
  font-size: clamp(1.35rem, 3vw, 2rem);
  font-weight: 580;
  letter-spacing: -0.035em;
}

.project-card code {
  display: block;
  margin-top: 0.45rem;
  color: #52735c;
  font-family: inherit;
  font-size: 0.875rem;
}

.project-card__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  min-height: 2.75rem;
  padding: 0.65rem 0.9rem;
  border: 1px solid #356944;
  border-radius: 0.45rem;
  color: #8de8a8;
  font-size: 0.875rem;
  text-decoration: none;
  white-space: nowrap;
  transition:
    background-color 140ms ease,
    color 140ms ease;
}

.project-card__link:hover {
  background: #45f47b;
  color: #031006;
}

.projects-footer {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding-top: 1.25rem;
  color: #52735c;
  font-size: 0.8125rem;
}

.projects-footer__status {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
  background: #45f47b;
  box-shadow: 0 0 0.75rem rgb(69 244 123 / 0.7);
}

@media (max-width: 620px) {
  .projects-page {
    padding: 1.25rem 1rem 2rem;
  }

  .projects-intro {
    padding: 3.5rem 0 3rem;
  }

  .project-card {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .project-card__link {
    grid-column: 1 / -1;
    margin-top: 0.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .project-card,
  .project-card__link {
    transition: none;
  }
}
</style>
