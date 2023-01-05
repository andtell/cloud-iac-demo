See https://www.digitalocean.com/community/tutorials/setting-up-a-node-project-with-typescript

npm install --save-dev typescript

cat <<EOF > tsconfig.json
  {
    "compilerOptions": {
        "module": "commonjs",
        "esModuleInterop": true,
        "target": "es6",
        "moduleResolution": "node",
        "sourceMap": true,
        "outDir": "dist"
    },
    "lib": ["es2015"]
  }
EOF


npm i express
npm i -D @types/express
npm i cors
npm i -D @types/cors

mkdir src && cd src
touc app.ts