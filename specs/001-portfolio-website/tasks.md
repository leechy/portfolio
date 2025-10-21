````markdown
---
description: 'Task list for Web Developer Portfolio Website implementation'
---

# Tasks: Web Developer Portfolio Website

**Input**: Design documents from `/specs/001-portfolio-website/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are MANDATORY per constitution. All tests must be written FIRST and FAIL before implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **SvelteKit project**: `src/` at repository root
- All paths shown assume SvelteKit structure from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create SvelteKit project structure with TypeScript support
- **T002**: Install and configure SCSS in src/app.scss - ✅ **COMPLETED**
- [x] T003 [P] Install testing dependencies (Vitest, Playwright, @testing-library/svelte)
- [x] T004 [P] Set up SQLite database connection in src/lib/database/connection.js
- [x] T005 Create database schema from data-model.md in src/lib/database/schema.sql
- [x] T006 [P] Configure Vite build settings for production optimization
- [x] T007 [P] Set up ESLint and Prettier configuration files

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T008 Create base layout with navigation in src/routes/+layout.svelte
- [x] T009 [P] Implement database query functions in src/lib/database/queries.js
- [x] T010 [P] Create shared TypeScript interfaces in src/lib/types.ts
- [x] T011 [P] Set up error handling utilities in src/lib/utils/errors.ts
- [x] T012 [P] Create responsive navigation component in src/lib/components/Navigation.svelte
- [x] T013 Initialize database with skills seed data using schema.sql
- [x] T014 [P] Set up image optimization utilities in src/lib/utils/images.ts
- [x] T015 [P] Configure SEO meta tag helpers in src/lib/utils/seo.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Portfolio Homepage Overview (Priority: P1) 🎯 MVP

**Goal**: Create homepage showcasing skills, featured projects, and contact information

**Independent Test**: Navigate to homepage and verify all key information (skills, projects, contact) is visible and accessible within 10 seconds

### Tests for User Story 1 ⚠️ (Write FIRST, ensure they FAIL)

- [ ] T016 [P] [US1] E2E test for homepage loading in tests/e2e/homepage.spec.ts
- [ ] T017 [P] [US1] Integration test for skills data loading in tests/integration/skills.test.ts
- [ ] T018 [P] [US1] Integration test for featured projects query in tests/integration/projects.test.ts
- [ ] T019 [P] [US1] Component test for SkillCard in tests/unit/SkillCard.test.ts

### Implementation for User Story 1

- [ ] T020 [P] [US1] Create Skills model and queries in src/lib/database/queries.js
- [ ] T021 [P] [US1] Create Projects model and featured projects query in src/lib/database/queries.js
- [ ] T022 [US1] Create homepage layout in src/routes/+page.svelte
- [ ] T023 [US1] Implement SkillCard component in src/lib/components/SkillCard.svelte
- [ ] T024 [US1] Implement ProjectCard component for featured projects in src/lib/components/ProjectCard.svelte
- [ ] T025 [US1] Create skills section with category grouping in src/routes/+page.svelte
- [ ] T026 [US1] Add hero section with developer intro in src/routes/+page.svelte
- [ ] T027 [US1] Implement featured projects section in src/routes/+page.svelte
- [ ] T028 [US1] Add contact information display in src/routes/+page.svelte
- [ ] T029 [US1] Implement responsive design for mobile devices in src/routes/+page.svelte
- [ ] T030 [US1] Add loading states and error handling for data fetching

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Project Deep Dive (Priority: P2)

**Goal**: Create detailed project pages with technologies, challenges, and solutions

**Independent Test**: Click on any project from homepage and view complete project detail page with all required information

### Tests for User Story 2 ⚠️ (Write FIRST, ensure they FAIL)

- [ ] T031 [P] [US2] E2E test for project detail page navigation in tests/e2e/project-details.spec.ts
- [ ] T032 [P] [US2] Integration test for project content loading in tests/integration/project-content.test.ts
- [ ] T033 [P] [US2] Component test for project carousel in tests/unit/ProjectCarousel.test.ts
- [ ] T034 [P] [US2] Integration test for projects filtering by skills in tests/integration/project-filtering.test.ts

### Implementation for User Story 2

- [ ] T035 [P] [US2] Create project detail queries with content loading in src/lib/database/queries.js
- [ ] T036 [P] [US2] Create projects overview page in src/routes/projects/+page.svelte
- [ ] T037 [P] [US2] Implement project filtering by skills in src/routes/projects/+page.svelte
- [ ] T038 [US2] Create dynamic project detail page in src/routes/projects/[slug]/+page.svelte
- [ ] T039 [US2] Implement ProjectCarousel component for screenshots in src/lib/components/ProjectCarousel.svelte
- [ ] T040 [US2] Create project content renderer for markdown in src/lib/utils/markdown.ts
- [ ] T041 [US2] Add project metadata display (technologies, challenges, solutions) in src/routes/projects/[slug]/+page.svelte
- [ ] T042 [US2] Implement skills demonstrated section in src/routes/projects/[slug]/+page.svelte
- [ ] T043 [US2] Add related projects suggestions in src/routes/projects/[slug]/+page.svelte
- [ ] T044 [US2] Create project-skills relationship queries in src/lib/database/queries.js
- [ ] T045 [US2] Implement 404 handling for non-existent projects in src/routes/projects/[slug]/+page.svelte

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Professional Blog Access (Priority: P3)

**Goal**: Create blog section with navigation between posts and organization features

**Independent Test**: Navigate to blog section and read published posts with clear navigation back to main portfolio

### Tests for User Story 3 ⚠️ (Write FIRST, ensure they FAIL)

- [ ] T046 [P] [US3] E2E test for blog navigation and post reading in tests/e2e/blog.spec.ts
- [ ] T047 [P] [US3] Integration test for blog post queries in tests/integration/blog.test.ts
- [ ] T048 [P] [US3] Component test for BlogPreview component in tests/unit/BlogPreview.test.ts
- [ ] T049 [P] [US3] Integration test for blog search functionality in tests/integration/blog-search.test.ts

### Implementation for User Story 3

- [ ] T050 [P] [US3] Create blog post queries and search in src/lib/database/queries.js
- [ ] T051 [P] [US3] Create blog overview page in src/routes/blog/+page.svelte
- [ ] T052 [US3] Implement BlogPreview component for post listings in src/lib/components/BlogPreview.svelte
- [ ] T053 [US3] Create dynamic blog post page in src/routes/blog/[slug]/+page.svelte
- [ ] T054 [US3] Implement blog post content rendering in src/routes/blog/[slug]/+page.svelte
- [ ] T055 [US3] Add blog post tagging and filtering in src/routes/blog/+page.svelte
- [ ] T056 [US3] Create blog search functionality in src/routes/blog/+page.svelte
- [ ] T057 [US3] Implement related posts suggestions in src/routes/blog/[slug]/+page.svelte
- [ ] T058 [US3] Add blog post metadata (date, read time, tags) in src/routes/blog/[slug]/+page.svelte
- [ ] T059 [US3] Create blog tag filtering system in src/routes/blog/+page.svelte

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Contact & API Features

**Purpose**: Contact form and API endpoints for dynamic features

- [ ] T060 [P] Create contact form component in src/routes/contact/+page.svelte
- [ ] T061 [P] Implement contact form submission API in src/routes/api/contact/+server.ts
- [ ] T062 [P] Create skills API endpoint in src/routes/api/skills/+server.ts
- [ ] T063 [P] Create projects API endpoint in src/routes/api/projects/+server.ts
- [ ] T064 [P] Create blog API endpoint in src/routes/api/blog/+server.ts
- [ ] T065 [P] Add form validation and error handling in src/routes/contact/+page.svelte
- [ ] T066 [P] Implement rate limiting for contact submissions in src/routes/api/contact/+server.ts
- [ ] T067 Test contact form submission end-to-end in tests/e2e/contact.spec.ts

---

## Phase 7: Performance & Accessibility

**Purpose**: Optimize for performance targets and accessibility requirements

- [ ] T068 [P] Implement image lazy loading in src/lib/components/OptimizedImage.svelte
- [ ] T069 [P] Add SEO meta tags to all pages using src/lib/utils/seo.ts
- [ ] T070 [P] Implement preloading for critical resources in src/app.html
- [ ] T071 [P] Add ARIA labels and accessibility features across components
- [ ] T072 [P] Optimize Tailwind CSS bundle size with purging configuration
- [ ] T073 [P] Add structured data markup for SEO in src/lib/utils/structured-data.ts
- [ ] T074 Run Lighthouse audits and achieve 90+ scores across all metrics
- [ ] T075 [P] Implement error boundaries and fallback UI in src/lib/components/ErrorBoundary.svelte

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and deployment preparation

- [ ] T076 [P] Add loading animations and transitions in src/lib/components/LoadingSpinner.svelte
- [ ] T077 [P] Implement dark theme consistency across all components
- [ ] T078 [P] Add comprehensive error pages (404, 500) in src/routes/+error.svelte
- [ ] T079 [P] Create deployment scripts and CI/CD configuration in .github/workflows/
- [ ] T080 [P] Add database backup and migration scripts in scripts/
- [ ] T081 Run full test coverage analysis and achieve 90%+ coverage
- [ ] T082 [P] Documentation updates in README.md and deployment guide
- [ ] T083 [P] Security headers and CSP configuration in src/hooks.server.ts
- [ ] T084 Performance monitoring setup and analytics integration
- [ ] T085 Run quickstart.md validation and deployment testing

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Contact & API (Phase 6)**: Can start after Foundational, runs parallel to user stories
- **Performance (Phase 7)**: Depends on all user stories being complete
- **Polish (Phase 8)**: Depends on all previous phases

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but independently testable

### Within Each User Story

- Tests (MANDATORY) MUST be written and FAIL before implementation
- Database queries before components
- Components before pages
- Core functionality before integration features
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Database queries within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "E2E test for homepage loading in tests/e2e/homepage.spec.ts"
Task: "Integration test for skills data loading in tests/integration/skills.test.ts"
Task: "Integration test for featured projects query in tests/integration/projects.test.ts"
Task: "Component test for SkillCard in tests/unit/SkillCard.test.ts"

# Launch all database work for User Story 1 together:
Task: "Create Skills model and queries in src/lib/database/queries.js"
Task: "Create Projects model and featured projects query in src/lib/database/queries.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 + Contact features
   - Developer B: User Story 2
   - Developer C: User Story 3 + Performance optimization
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Tests MUST be written first and fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Constitution requires 90%+ test coverage - comprehensive testing mandatory
- Performance targets: <3s load times, 90+ Lighthouse scores
- Accessibility target: 90%+ accessibility score for screen readers and keyboard navigation
````
