# Prototype demo videos

Regenerates the five smooth (30 fps) demo videos in `public/media/` from the prototypes in `public/prototypes/`.

1. Start the site: `npm run build && npx next start -p 3112`
2. Capture each story's screens: `node tools/demo-videos/capture.mjs http://localhost:3112 /tmp/demo [slug]`
   (run from the project root so Playwright resolves)
3. Render: `python render.py /tmp/demo <slug> public/media/<slug>.mp4 <path-to-ffmpeg> public/inter.woff2`
   Needs Pillow and an ffmpeg binary (`pip install pillow imageio-ffmpeg`; `python -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())"`).

Each story (screens, captions, camera moves, clicks) is defined in `capture.mjs`.
