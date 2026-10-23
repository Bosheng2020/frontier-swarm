# Visual assets

- `social-preview.png` is the 1280×640 repository sharing image intended for GitHub's Social Preview setting.
- `frontier-swarm-demo.gif` is an offline deterministic walkthrough of the orchestration shape using an authored fixture. It makes no model calls and is not benchmark evidence.

Both assets are generated deterministically by the optional maintainer helper `scripts/render_assets.py`. It requires Python 3 and Pillow, but neither is part of the application runtime:

```bash
python -m pip install pillow
python scripts/render_assets.py
```

The rendering script is maintainer tooling; it is not required to install, run, or evaluate Frontier Swarm.
