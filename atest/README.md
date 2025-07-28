# Acceptance Tests

Acceptance tests are implemented with Robot Framework.

[Robot Framework](https://robotframework.org) is an open source framework for keyword-driven test- and task automation published under Apache 2.0 license. Instructions are implemented in so called library keywords, which are often implemented in Python. Those libraries are provided, so that automation engineers can focus on structuring and organisation of human readible specifications. Robot Framework is owned by the [Robot Framework Foundation](https://robotframework.org/foundation) backed up by member companies financing the project.

## Prepare Development Environment

You will have best experience in VSCode or VSCodium with Robotcode Extension `d-biehl.robotcode`. Checkout [recommendations for VSCode extensions](.vscode/extensions.json).

### 1. Install uv

uv is a super fast package manager for Python. It allows dependency management for different groups/profiles, i.e. development, ci, prod.

**Linux/macOS:**
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

**Windows (PowerShell):**
```powershell
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### 2. Setup Virtual Environment and Dependencies

Since Operaton web-apps is mainly a nodejs project, Robot Framework depdencies are manged in the
subfolder `atest`. 

Navigate to the acceptance tests directory:
```bash
cd atest
```

Create and activate virtual environment, then install dependencies:
```bash
uv venv
uv sync
```

After installing python dependencies, execute (only required once)
```bash
uv run rfbrowser init
```

`rfbrowser` installs playwright dependencies. Depending on your host system, the installation may fail
due to missing system dependencies. Consult the LLM of your choice for instructions of your operating system.

### 3. Activate Virtual Environment

Often your IDE has an option to activate the virtual python environment.

#### VSCode

Press `Ctrl + Shift + P` and choose `Python: Select Interpreter` and choose the `python` executable from 
your `.venv`folder (usually, `${workspace}/atest/.venv/bin/python`). 

#### Shell

**Linux/macOS:**
```bash
source .venv/bin/activate
```

**Windows:**
```cmd
.venv\Scripts\activate
```

### 4. Verify Installation

Check that Robot Framework is installed:
```bash
robot --version
```

You're now ready to run the acceptance tests!

## Support

Robot Framework Browser Testing:
- [Robot Framework Browser Documentation](https://robotframework-browser.org)

Robot Framework in General:
- [Robot Framework Forum](https://forum.robotframework.org)
- [Robot Framework Documentation](https://docs.robotframework.org)
- [Robot Framework Official Website](https://robotframework.org)