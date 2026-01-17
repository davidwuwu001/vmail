2026-01-17T02:27:29.623Z	Initializing build environment...
2026-01-17T02:27:31.995Z	Success: Finished initializing build environment
2026-01-17T02:27:32.419Z	Cloning repository...
2026-01-17T02:27:33.806Z	Restoring from dependencies cache
2026-01-17T02:27:33.807Z	Restoring from build output cache
2026-01-17T02:27:35.391Z	Detected the following tools from environment: pnpm@9.1.0, nodejs@22.16.0
2026-01-17T02:27:37.257Z	Installing project dependencies: pnpm install --frozen-lockfile
2026-01-17T02:27:37.981Z	Scope: all 2 workspace projects
2026-01-17T02:27:38.032Z	Lockfile is up to date, resolution step is skipped
2026-01-17T02:27:38.098Z	Progress: resolved 1, reused 0, downloaded 0, added 0
2026-01-17T02:27:38.167Z	Packages: +313
2026-01-17T02:27:38.170Z	++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
2026-01-17T02:27:39.099Z	Progress: resolved 313, reused 0, downloaded 12, added 12
2026-01-17T02:27:40.101Z	Progress: resolved 313, reused 0, downloaded 43, added 43
2026-01-17T02:27:41.101Z	Progress: resolved 313, reused 0, downloaded 70, added 70
2026-01-17T02:27:42.101Z	Progress: resolved 313, reused 0, downloaded 114, added 113
2026-01-17T02:27:43.103Z	Progress: resolved 313, reused 0, downloaded 157, added 157
2026-01-17T02:27:44.103Z	Progress: resolved 313, reused 0, downloaded 196, added 196
2026-01-17T02:27:45.104Z	Progress: resolved 313, reused 0, downloaded 228, added 227
2026-01-17T02:27:46.103Z	Progress: resolved 313, reused 0, downloaded 240, added 233
2026-01-17T02:27:47.103Z	Progress: resolved 313, reused 0, downloaded 252, added 243
2026-01-17T02:27:48.103Z	Progress: resolved 313, reused 0, downloaded 282, added 282
2026-01-17T02:27:49.103Z	Progress: resolved 313, reused 0, downloaded 311, added 311
2026-01-17T02:27:50.103Z	Progress: resolved 313, reused 0, downloaded 312, added 312
2026-01-17T02:27:53.653Z	Progress: resolved 313, reused 0, downloaded 313, added 312
2026-01-17T02:27:53.655Z	Progress: resolved 313, reused 0, downloaded 313, added 313, done
2026-01-17T02:27:53.828Z	.../sharp@0.33.5/node_modules/sharp install$ node install/check
2026-01-17T02:27:53.829Z	.../node_modules/workerd postinstall$ node install.js
2026-01-17T02:27:53.852Z	.../esbuild@0.21.5/node_modules/esbuild postinstall$ node install.js
2026-01-17T02:27:53.866Z	.../esbuild@0.17.19/node_modules/esbuild postinstall$ node install.js
2026-01-17T02:27:54.047Z	.../esbuild@0.21.5/node_modules/esbuild postinstall: Done
2026-01-17T02:27:54.137Z	.../esbuild@0.17.19/node_modules/esbuild postinstall: Done
2026-01-17T02:27:54.165Z	.../node_modules/workerd postinstall: Done
2026-01-17T02:27:54.198Z	.../sharp@0.33.5/node_modules/sharp install: Done
2026-01-17T02:27:54.592Z	
2026-01-17T02:27:54.593Z	dependencies:
2026-01-17T02:27:54.593Z	+ @libsql/client 0.4.0-pre.7
2026-01-17T02:27:54.593Z	+ @tanstack/react-query 5.90.3
2026-01-17T02:27:54.593Z	+ date-fns 3.6.0
2026-01-17T02:27:54.593Z	+ drizzle-orm 0.29.5
2026-01-17T02:27:54.593Z	+ drizzle-zod 0.5.1
2026-01-17T02:27:54.594Z	+ hono 4.9.12
2026-01-17T02:27:54.594Z	+ nanoid 5.1.6
2026-01-17T02:27:54.594Z	+ postal-mime 2.4.7
2026-01-17T02:27:54.594Z	+ zod 3.25.76
2026-01-17T02:27:54.594Z	
2026-01-17T02:27:54.594Z	devDependencies:
2026-01-17T02:27:54.594Z	+ prettier 3.6.2
2026-01-17T02:27:54.596Z	+ prettier-plugin-tailwindcss 0.5.14
2026-01-17T02:27:54.596Z	+ wrangler 3.114.15
2026-01-17T02:27:54.596Z	
2026-01-17T02:27:54.623Z	Done in 17.1s
2026-01-17T02:27:55.056Z	Executing user build command: pnpm run build
2026-01-17T02:27:55.570Z	
2026-01-17T02:27:55.570Z	> vmail@1.0.0 build /opt/buildhome/repo
2026-01-17T02:27:55.570Z	> pnpm --filter frontend run build
2026-01-17T02:27:55.570Z	
2026-01-17T02:27:56.014Z	
2026-01-17T02:27:56.014Z	> frontend@0.0.0 build /opt/buildhome/repo/frontend
2026-01-17T02:27:56.014Z	> vite build
2026-01-17T02:27:56.015Z	
2026-01-17T02:27:59.070Z	vite v5.4.20 building for production...
2026-01-17T02:27:59.140Z	transforming...
2026-01-17T02:27:59.319Z	[baseline-browser-mapping] The data in this module is over two months old.  To ensure accurate Baseline data, please update: `npm i baseline-browser-mapping@latest -D`
2026-01-17T02:28:03.865Z	✓ 1370 modules transformed.
2026-01-17T02:28:04.398Z	rendering chunks...
2026-01-17T02:28:04.413Z	computing gzip size...
2026-01-17T02:28:04.439Z	build/client/index.html                  0.46 kB │ gzip:   0.32 kB
2026-01-17T02:28:04.441Z	build/client/assets/main-B3RYd5Io.css   27.92 kB │ gzip:   5.99 kB
2026-01-17T02:28:04.441Z	build/client/assets/main-uPThwv8s.js   535.93 kB │ gzip: 173.25 kB
2026-01-17T02:28:04.441Z	✓ built in 5.34s
2026-01-17T02:28:04.442Z	
2026-01-17T02:28:04.444Z	(!) Some chunks are larger than 500 kB after minification. Consider:
2026-01-17T02:28:04.444Z	- Using dynamic import() to code-split the application
2026-01-17T02:28:04.445Z	- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
2026-01-17T02:28:04.445Z	- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
2026-01-17T02:28:04.530Z	Success: Build command completed
2026-01-17T02:28:04.716Z	Executing user deploy command: npx wrangler deploy
2026-01-17T02:28:09.845Z	
2026-01-17T02:28:09.846Z	 ⛅️ wrangler 3.114.15 (update available 4.59.2)
2026-01-17T02:28:09.846Z	-----------------------------------------------
2026-01-17T02:28:09.846Z	
2026-01-17T02:28:09.914Z	▲ [WARNING] The version of Wrangler you are using is now out-of-date.
2026-01-17T02:28:09.915Z	
2026-01-17T02:28:09.915Z	  Please update to the latest version to prevent critical errors.
2026-01-17T02:28:09.915Z	  Run `npm install --save-dev wrangler@4` to update to the latest version.
2026-01-17T02:28:09.915Z	  After installation, run Wrangler with `npx wrangler`.
2026-01-17T02:28:09.916Z	
2026-01-17T02:28:09.916Z	
2026-01-17T02:28:09.922Z	[custom build] Running: pnpm run build
2026-01-17T02:28:10.323Z	[custom build] 
2026-01-17T02:28:10.323Z	[custom build] > vmail@1.0.0 build /opt/buildhome/repo
2026-01-17T02:28:10.323Z	[custom build] > pnpm --filter frontend run build
2026-01-17T02:28:10.323Z	[custom build] 
2026-01-17T02:28:10.323Z	[custom build] 
2026-01-17T02:28:10.810Z	[custom build] 
2026-01-17T02:28:10.810Z	[custom build] > frontend@0.0.0 build /opt/buildhome/repo/frontend
2026-01-17T02:28:10.811Z	[custom build] > vite build
2026-01-17T02:28:10.811Z	[custom build] 
2026-01-17T02:28:10.811Z	[custom build] 
2026-01-17T02:28:11.107Z	[custom build] vite v5.4.20 building for production...
2026-01-17T02:28:11.107Z	[custom build] 
2026-01-17T02:28:11.171Z	[custom build] transforming...
2026-01-17T02:28:11.173Z	[custom build] 
2026-01-17T02:28:11.361Z	[custom build] [baseline-browser-mapping] The data in this module is over two months old.  To ensure accurate Baseline data, please update: `npm i baseline-browser-mapping@latest -D`
2026-01-17T02:28:11.363Z	[custom build] 
2026-01-17T02:28:15.943Z	[custom build] ✓ 1370 modules transformed.
2026-01-17T02:28:15.944Z	[custom build] 
2026-01-17T02:28:16.508Z	[custom build] rendering chunks...
2026-01-17T02:28:16.509Z	[custom build] 
2026-01-17T02:28:16.526Z	[custom build] computing gzip size...
2026-01-17T02:28:16.529Z	[custom build] 
2026-01-17T02:28:16.551Z	[custom build] build/client/index.html                  0.46 kB │ gzip:   0.32 kB
2026-01-17T02:28:16.552Z	[custom build] 
2026-01-17T02:28:16.553Z	[custom build] build/client/assets/main-B3RYd5Io.css   27.92 kB │ gzip:   5.99 kB
2026-01-17T02:28:16.553Z	[custom build] build/client/assets/main-uPThwv8s.js   535.93 kB │ gzip: 173.25 kB
2026-01-17T02:28:16.553Z	[custom build] ✓ built in 5.41s
2026-01-17T02:28:16.553Z	[custom build] 
2026-01-17T02:28:16.556Z	[custom build] 
2026-01-17T02:28:16.556Z	[custom build] (!) Some chunks are larger than 500 kB after minification. Consider:
2026-01-17T02:28:16.556Z	[custom build] - Using dynamic import() to code-split the application
2026-01-17T02:28:16.556Z	[custom build] - Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
2026-01-17T02:28:16.556Z	[custom build] - Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
2026-01-17T02:28:16.557Z	[custom build] 
2026-01-17T02:28:17.874Z	🌀 Building list of assets...
2026-01-17T02:28:17.898Z	🌀 Starting asset upload...
2026-01-17T02:28:20.908Z	🌀 Found 19 new or modified static assets to upload. Proceeding with upload...
2026-01-17T02:28:20.909Z	+ /index.html
2026-01-17T02:28:20.910Z	+ /locales/tr/common.json
2026-01-17T02:28:20.911Z	+ /locales/zh/common.json
2026-01-17T02:28:20.911Z	+ /locales/fr/common.json
2026-01-17T02:28:20.912Z	+ /locales/ru/common.json
2026-01-17T02:28:20.912Z	+ /vmail.png
2026-01-17T02:28:20.913Z	+ /assets/main-uPThwv8s.js
2026-01-17T02:28:20.913Z	+ /vmail.svg
2026-01-17T02:28:20.913Z	+ /locales/pt/common.json
2026-01-17T02:28:20.913Z	+ /locales/de/common.json
2026-01-17T02:28:20.914Z	+ /locales/ko/common.json
2026-01-17T02:28:20.914Z	+ /locales/hi/common.json
2026-01-17T02:28:20.914Z	+ /assets/main-B3RYd5Io.css
2026-01-17T02:28:20.914Z	+ /locales/zh-TW/common.json
2026-01-17T02:28:20.914Z	+ /locales/it/common.json
2026-01-17T02:28:20.914Z	+ /locales/en/common.json
2026-01-17T02:28:20.914Z	+ /locales/ja/common.json
2026-01-17T02:28:20.914Z	+ /favicon.ico
2026-01-17T02:28:20.914Z	+ /preview.png
2026-01-17T02:28:21.961Z	Uploaded 6 of 19 assets
2026-01-17T02:28:22.524Z	Uploaded 12 of 19 assets
2026-01-17T02:28:24.967Z	Uploaded 19 of 19 assets
2026-01-17T02:28:24.968Z	✨ Success! Uploaded 19 files (4.05 sec)
2026-01-17T02:28:24.968Z	
2026-01-17T02:28:24.979Z	Total Upload: 236.25 KiB / gzip: 69.54 KiB
2026-01-17T02:28:25.290Z	Your worker has access to the following bindings:
2026-01-17T02:28:25.291Z	- D1 Databases:
2026-01-17T02:28:25.291Z	  - DB: ${D1_DATABASE_NAME} (${D1_DATABASE_ID})
2026-01-17T02:28:25.291Z	- Vars:
2026-01-17T02:28:25.291Z	  - EMAIL_DOMAIN: "${EMAIL_DOMAIN}"
2026-01-17T02:28:25.291Z	  - TURNSTILE_KEY: "${TURNSTILE_KEY}"
2026-01-17T02:28:25.291Z	  - COOKIES_SECRET: "${COOKIES_SECRET}"
2026-01-17T02:28:25.291Z	  - TURNSTILE_SECRET: "${TURNSTILE_SECRET}"
2026-01-17T02:28:25.298Z	
2026-01-17T02:28:25.300Z	✘ [ERROR] A request to the Cloudflare API (/accounts/db2645f3e7d4fcc17f20c028a285c1b7/workers/scripts/vmail/versions) failed.
2026-01-17T02:28:25.300Z	
2026-01-17T02:28:25.300Z	  binding DB of type d1 must have a valid `id` specified [code: 10021]
2026-01-17T02:28:25.300Z	  To learn more about this error, visit: https://developers.cloudflare.com/workers/observability/errors/#validation-errors-10021
2026-01-17T02:28:25.300Z	
2026-01-17T02:28:25.300Z	  
2026-01-17T02:28:25.300Z	  If you think this is a bug, please open an issue at: https://github.com/cloudflare/workers-sdk/issues/new/choose
2026-01-17T02:28:25.300Z	
2026-01-17T02:28:25.300Z	
2026-01-17T02:28:25.301Z	
2026-01-17T02:28:25.301Z	Cloudflare collects anonymous telemetry about your usage of Wrangler. Learn more at https://github.com/cloudflare/workers-sdk/tree/main/packages/wrangler/telemetry.md
2026-01-17T02:28:25.330Z	🪵  Logs were written to "/opt/buildhome/.config/.wrangler/logs/wrangler-2026-01-17_02-28-05_705.log"
2026-01-17T02:28:28.341Z	Failed: error occurred while running deploy command