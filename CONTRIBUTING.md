# Contributing to OpenBuild

First off, thank you for considering contributing to OpenBuild! It's people like you that make OpenBuild such a great tool.

## Attribution

OpenBuild was originally created by **Grandillionaire (Maximillian Grand)**. Please ensure any use, modification, or distribution of this software includes attribution to the original creator.

## Code of Conduct

By participating in this project, you are expected to uphold our values:
- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive criticism
- Respect differing viewpoints and experiences

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- A clear and descriptive title
- Exact steps to reproduce the problem
- Expected behavior vs actual behavior
- Screenshots if applicable
- Your environment details (OS, browser, Node version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- A clear and descriptive title
- A detailed description of the proposed enhancement
- Explain why this enhancement would be useful
- List any alternatives you've considered

### Pull Requests

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Run tests (`npm run test`)
5. Ensure code passes linting (`npm run lint`)
6. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
7. Push to the branch (`git push origin feature/AmazingFeature`)
8. Open a Pull Request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/openbuild.git
cd openbuild

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

## Project Structure

```
openbuild/
├── src/
│   ├── components/     # Vue components
│   ├── stores/         # Pinia stores
│   ├── services/       # Business logic
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   └── composables/    # Vue composables
├── public/             # Static assets
└── tests/              # Test files
```

## Coding Guidelines

### Vue Components
- Use Composition API with `<script setup>`
- Follow single-file component structure
- Keep components focused and small
- Use TypeScript for props and emits

### TypeScript
- Always define types for props, emits, and function parameters
- Avoid using `any` type
- Use interfaces over type aliases when possible

### Styling
- Use UnoCSS utility classes
- Keep component-specific styles in `<style scoped>`
- Follow mobile-first responsive design

### Naming Conventions
- Components: PascalCase (e.g., `ComponentRenderer.vue`)
- Composables: camelCase with 'use' prefix (e.g., `useKeyboardShortcuts.ts`)
- Files: kebab-case for non-components
- CSS classes: kebab-case

### Git Commit Messages
- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests

Examples:
```
feat: Add animation timeline editor
fix: Resolve memory leak in component renderer
docs: Update API documentation
style: Format code according to style guide
refactor: Extract reusable logic to composables
test: Add unit tests for editor store
chore: Update dependencies
```

## Testing

- Write tests for new features
- Ensure existing tests pass
- Aim for good coverage of critical paths
- Use descriptive test names

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Documentation

- Update README.md if needed
- Document complex logic with comments
- Add JSDoc comments for public APIs
- Update TypeScript types

## Review Process

1. All submissions require review
2. We use GitHub pull request reviews
3. Changes may be requested before merging
4. Be patient and respectful during review

## Community

- Join discussions in GitHub Issues
- Help others in the community
- Share your projects built with OpenBuild
- Spread the word!

## License

By contributing, you agree that your contributions will be licensed under the MIT License with attribution requirements as specified in the LICENSE file.

Thank you for contributing to OpenBuild! 🚀