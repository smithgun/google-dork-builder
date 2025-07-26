# Git Workflow Guidelines

## Branch Structure

- **`main`** - Production-ready code only
  - Protected branch
  - Only accepts PRs from `develop` or `hotfix/*`
  - All releases are tagged from this branch

- **`develop`** - Integration branch for features
  - Default development branch  
  - Features are merged here first
  - Used for staging/testing before production

- **`feature/*`** - Individual feature development
  - Branch from: `develop`
  - Merge back to: `develop`
  - Naming: `feature/description-of-feature`

- **`hotfix/*`** - Critical production fixes
  - Branch from: `main`
  - Merge to: both `main` and `develop`
  - Naming: `hotfix/critical-fix-description`

## Workflow Commands

### Starting New Feature
```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
# ... make changes ...
git add .
git commit -m "feat: add your feature description"
git push -u origin feature/your-feature-name
# Create PR on GitHub: develop ← feature/your-feature-name
```

### Hotfix Process
```bash
git checkout main
git pull origin main
git checkout -b hotfix/critical-fix
# ... make fixes ...
git add .
git commit -m "fix: critical issue description"
git push -u origin hotfix/critical-fix
# Create PR on GitHub: main ← hotfix/critical-fix
# After merge to main, also merge to develop
```

### Release Process
```bash
git checkout develop
git pull origin develop
git checkout -b release/v1.0.0
# ... final testing and minor fixes ...
git add .
git commit -m "chore: prepare release v1.0.0"
git push -u origin release/v1.0.0
# Create PR on GitHub: main ← release/v1.0.0
# After merge, tag the release
git checkout main
git pull origin main
git tag v1.0.0
git push origin v1.0.0
```

## Commit Message Conventions

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## Pull Request Guidelines

1. **Always create PRs** - Never push directly to `main` or `develop`
2. **Descriptive titles** - Clearly explain what the PR does
3. **Link issues** - Reference related GitHub issues
4. **Request reviews** - Get code reviewed before merging
5. **Keep PRs small** - Easier to review and less risky
6. **Update documentation** - Keep README and docs current

## Branch Protection Rules (GitHub Settings)

### Main Branch Protection:
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging  
- ✅ Require branches to be up to date before merging
- ✅ Require conversation resolution before merging
- ✅ Include administrators in restrictions

### Develop Branch Protection:
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging
