import os
import subprocess

def run(cmd):
    p = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if p.returncode != 0:
        print(f"Error: {cmd}\n{p.stderr}")
    return p.stdout.strip()

# List individual untracked files
untracked = run("git ls-files --others --exclude-standard").splitlines()
# List modified files
modified = run("git ls-files --modified").splitlines()

all_files = list(set(untracked + modified))
all_files.sort()

print(f"Total individual files to commit: {len(all_files)}")

def get_commit_message(f):
    f_norm = f.replace('\\', '/')
    filename = os.path.basename(f_norm)
    name_no_ext = os.path.splitext(filename)[0]

    if f_norm.startswith('.agent/workflows/'):
        return f"docs(workflow): add {name_no_ext} workflow guide"
    elif f_norm.startswith('.agents/agents/'):
        return f"feat(agent): add {name_no_ext} agent profile definition"
    elif f_norm.startswith('.agents/skills/'):
        skill_name = f_norm.split('/')[2]
        return f"feat(skill): add {skill_name} skill definition"
    elif f_norm.startswith('.gsd/templates/'):
        return f"docs(template): add {name_no_ext} documentation template"
    elif f_norm.startswith('.gsd/examples/'):
        return f"docs(example): add {name_no_ext} reference guide"
    elif f_norm.startswith('adapters/'):
        return f"feat(adapter): add {name_no_ext} model adapter profile"
    elif f_norm.startswith('scripts/'):
        return f"chore(script): add {filename} validation script"
    elif f_norm.startswith('backend/app/services/'):
        return f"feat(service): add {name_no_ext} module"
    elif f_norm.startswith('backend/app/api/endpoints/'):
        return f"feat(api): add {name_no_ext} endpoint router"
    elif f_norm.startswith('backend/app/core/'):
        return f"feat(backend): configure {name_no_ext}"
    elif f_norm.startswith('backend/app/models/'):
        return f"feat(db): define {name_no_ext} database models"
    elif f_norm.startswith('backend/app/schemas/'):
        return f"feat(api): define {name_no_ext} Pydantic schemas"
    elif f_norm.startswith('backend/tests/'):
        return f"test(backend): add {name_no_ext} test suite"
    elif f_norm.startswith('backend/saved_models/'):
        return f"feat(models): serialize {name_no_ext} artifact"
    elif f_norm.startswith('backend/data/'):
        return f"feat(data): add {filename} dataset"
    elif f_norm.startswith('frontend/src/pages/'):
        return f"feat(ui): implement {name_no_ext} view"
    elif f_norm.startswith('frontend/src/components/layout/'):
        return f"feat(ui): implement {name_no_ext} layout component"
    elif f_norm.startswith('frontend/src/services/'):
        return f"feat(frontend): implement {name_no_ext} service layer"
    elif f_norm.startswith('frontend/src/types/'):
        return f"feat(frontend): define {name_no_ext} TypeScript domain interfaces"
    elif f_norm.startswith('frontend/src/assets/'):
        return f"feat(assets): add {filename} asset"
    elif f_norm.startswith('frontend/public/'):
        return f"feat(public): add {filename} icon"
    elif f_norm == 'frontend/src/App.tsx':
        return "feat(frontend): configure application routing table"
    elif f_norm == 'frontend/src/index.css':
        return "style(frontend): define Tailwind theme design tokens"
    elif f_norm == 'frontend/vite.config.ts':
        return "build(frontend): configure Vite with Tailwind and proxy"
    elif f_norm == 'frontend/package.json':
        return "build(frontend): add npm dependencies"
    elif f_norm == 'frontend/package-lock.json':
        return "build(frontend): record package lockfile"
    elif f_norm == 'backend/requirements.txt':
        return "build(backend): record python pip dependencies"
    elif f_norm == 'backend/main.py' or f_norm == 'backend/app/main.py':
        return "feat(backend): configure FastAPI entrypoint and startup seed"
    elif f_norm == 'backend/run.py':
        return "chore(backend): add uvicorn server runner"
    elif f_norm == 'Dockerfile':
        return "build(docker): add backend multi-stage Dockerfile"
    elif f_norm == 'docker-compose.yml':
        return "build(docker): add docker-compose container configuration"
    elif f_norm == '.gitignore':
        return "chore: define git ignore rules"
    elif f_norm == '.env.example':
        return "chore: provide environment variables template"
    elif f_norm == 'README.md':
        return "docs: finalize comprehensive DroughtSense documentation"
    elif f_norm == 'PROJECT_RULES.md':
        return "docs: record GSD canonical project rules"
    elif f_norm == 'GSD-STYLE.md':
        return "docs: record GSD documentation style guide"
    else:
        return f"chore: add {filename}"

count = 0
for f in all_files:
    if not os.path.exists(f):
        continue
    run(f'git add "{f}"')
    msg = get_commit_message(f)
    run(f'git commit -m "{msg}"')
    count += 1

print(f"Created {count} atomic commits successfully!")
