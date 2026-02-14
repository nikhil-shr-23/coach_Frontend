# Repository Guidelines

## Project Structure & Module Organization
- Source code lives in `src/main/java/com/raghav/peadologicalbackend` with feature packages like `entity`, `repository`, `service`, and `controller`.
- Resources (config, properties) are under `src/main/resources`.
- Tests (if added) should go in `src/test/java` mirroring the main package structure.
- Build artifacts are generated under `target/`.

## Build, Test, and Development Commands
- `./mvnw clean package` (or `mvnw.cmd` on Windows): builds the application JAR.
- `./mvnw test`: runs the test suite.
- `./mvnw spring-boot:run`: runs the API locally.

## Coding Style & Naming Conventions
- Java 17, standard Spring Boot conventions.
- Use 4-space indentation and one class per file.
- Packages are lowercase (`entity`, `service`), classes are `PascalCase`, methods/fields are `camelCase`.
- DTOs live in `dto` and use `*Request` / `*Response` suffixes.

## Testing Guidelines
- Current stack uses Spring Boot test dependencies; add tests with JUnit 5 (`@SpringBootTest` or slice tests).
- Name test classes like `UserServiceTest` or `UserControllerTest` and place them under `src/test/java` in the matching package.
- Run tests via `./mvnw test`.

## Commit & Pull Request Guidelines
- Recent commit messages are short, title-case or sentence-case (e.g., `Auth completed`, `initial commit`, `time`). Keep messages concise and task-focused.
- PRs should include a clear description, linked issues (if any), and test evidence (command output or steps). Screenshots are optional for API-only changes.

## Security & Configuration Tips
- Configure MySQL credentials in `src/main/resources/application.properties` (or environment variables) and avoid committing secrets.
- Keep JWT secrets and database passwords out of source control.
