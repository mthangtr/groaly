# Testing with Beads

## Testing Isolation

**CRITICAL:** NEVER pollute the production database with test data!

Always use isolated test databases when testing beads functionality.

## For Manual Testing

Use the `BEADS_DB` environment variable to point to a temporary database:

```bash
# Create test issues in isolated database
BEADS_DB=/tmp/test.db bd init --quiet --prefix test
BEADS_DB=/tmp/test.db bd create "Test issue" --type task --priority 1

# Run commands with test database
BEADS_DB=/tmp/test.db bd ready
BEADS_DB=/tmp/test.db bd list

# Quick one-liner testing
BEADS_DB=/tmp/test.db bd create "Test feature" --type feature --priority 1
```

### Windows Testing

On Windows, use a temporary directory:

```powershell
# PowerShell
$env:BEADS_DB = "$env:TEMP\test.db"
bd init --quiet --prefix test
bd create "Test issue" --type task --priority 1

# Clean up after testing
Remove-Item $env:TEMP\test.db
Remove-Item -Recurse $env:TEMP\.beads
```

```cmd
REM Command Prompt
set BEADS_DB=%TEMP%\test.db
bd init --quiet --prefix test
bd create "Test issue" --type task --priority 1

REM Clean up
del %TEMP%\test.db
rmdir /s /q %TEMP%\.beads
```

## For Automated Tests

### Node.js / JavaScript

```javascript
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

function runBdTest(command) {
  const testDb = path.join(os.tmpdir(), `test-${Date.now()}.db`);
  const env = { ...process.env, BEADS_DB: testDb };
  
  try {
    return execSync(`bd ${command}`, { env, encoding: 'utf8' });
  } finally {
    // Clean up (optional - temp files auto-deleted on reboot)
    try {
      fs.unlinkSync(testDb);
    } catch (e) {}
  }
}

// Example test
describe('Beads Integration', () => {
  it('should create issues', () => {
    const result = runBdTest('create "Test" --type task -p 1 --json');
    const issue = JSON.parse(result);
    expect(issue.title).toBe('Test');
  });
});
```

### Python

```python
import os
import tempfile
import subprocess
from contextlib import contextmanager

@contextmanager
def isolated_beads_db():
    """Context manager for isolated beads testing"""
    with tempfile.TemporaryDirectory() as tmpdir:
        test_db = os.path.join(tmpdir, 'test.db')
        env = os.environ.copy()
        env['BEADS_DB'] = test_db
        
        # Initialize
        subprocess.run(['bd', 'init', '--quiet', '--prefix', 'test'], 
                      env=env, check=True)
        
        yield env

# Example test
def test_beads_create():
    with isolated_beads_db() as env:
        result = subprocess.run(
            ['bd', 'create', 'Test', '--type', 'task', '-p', '1', '--json'],
            env=env,
            capture_output=True,
            text=True,
            check=True
        )
        issue = json.loads(result.stdout)
        assert issue['title'] == 'Test'
```

### Go

```go
func TestBeadsIntegration(t *testing.T) {
    tmpDir := t.TempDir()
    testDB := filepath.Join(tmpDir, ".beads", "beads.db")
    
    // Set environment
    os.Setenv("BEADS_DB", testDB)
    defer os.Unsetenv("BEADS_DB")
    
    // Initialize
    cmd := exec.Command("bd", "init", "--quiet", "--prefix", "test")
    if err := cmd.Run(); err != nil {
        t.Fatalf("Failed to init: %v", err)
    }
    
    // Create test issue
    cmd = exec.Command("bd", "create", "Test", "--type", "task", "-p", "1", "--json")
    output, err := cmd.Output()
    if err != nil {
        t.Fatalf("Failed to create: %v", err)
    }
    
    var issue map[string]interface{}
    if err := json.Unmarshal(output, &issue); err != nil {
        t.Fatalf("Failed to parse: %v", err)
    }
    
    if issue["title"] != "Test" {
        t.Errorf("Expected title 'Test', got %v", issue["title"])
    }
}
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Integration Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install bd
        run: |
          go install github.com/steveyegge/beads/cmd/bd@latest
      
      - name: Run integration tests
        run: |
          # Tests automatically use BEADS_DB or temp directories
          npm test
        env:
          BEADS_DB: /tmp/ci-test.db
```

## Warning Detection

bd will warn you when creating issues with test-related titles in the production database:

```bash
# This triggers a warning if not using BEADS_DB
bd create "Test feature" -p 1

# Warning output:
# ⚠ Creating test issue in production database!
#   Issue title contains 'Test' or 'test'
#   Consider using BEADS_DB=/tmp/test.db for testing
```

## Best Practices

1. **Always use BEADS_DB for manual testing**
2. **Use temp directories in automated tests** (t.TempDir(), tempfile, etc.)
3. **Never commit test issues to production database**
4. **Clean up test databases after testing** (optional - temp dirs auto-clean)
5. **Use descriptive test prefixes** (e.g., `test-`, `tmp-`, `ci-`)

## Troubleshooting

### "Database is locked" errors

If tests fail with lock errors, ensure:
- Each test uses its own isolated database
- Tests don't share BEADS_DB values
- Daemon is not running against test database

```bash
# Check for running daemons
bd daemon list

# Stop all daemons if needed
bd daemon killall
```

### Test pollution in production

If you accidentally created test issues in production:

```bash
# Find test issues
bd list --json | grep -i test

# Close them with reason
bd close <id1> <id2> <id3> --reason="Test issue, created in error"

# Or delete if they were never pushed
# (use with caution - irreversible)
```

---

**Remember:** Test isolation protects your production issue database and enables safe parallel testing.
