const fs = require('fs');
const path = require('path');

// .envファイルを読み込む簡易関数
const loadEnv = () => {
  const envPath = path.resolve(__dirname, '.env');
  const env = {};
  
  if (fs.existsSync(envPath)) {
    console.log('.env file found, loading variables...');
    const file = fs.readFileSync(envPath, 'utf8');
    file.split('\n').forEach(line => {
      // コメントや空行をスキップ
      if (!line || line.startsWith('#')) return;
      
      // KEY=VALUE の形式を解析
      const parts = line.split('=');
      const key = parts[0].trim();
      // 値に '=' が含まれる場合を考慮して結合
      let value = parts.slice(1).join('=').trim();
      
      if (key && value) {
        // クォート (' または ") を除去
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        env[key] = value;
      }
    });
  } else {
    console.warn('.env file not found at:', envPath);
  }
  return env;
};

module.exports = {
  apps: [
    {
      name: 'shortlink',
      port: 3006,
      exec_mode: 'cluster',
      instances: 'max', // 全CPUコアを使用
      script: './.output/server/index.mjs',
      env: {
        ...loadEnv(), // .envの内容を展開
        NITRO_PORT: 3006,
        PORT: 3006,
        NODE_ENV: 'production'
      }
    }
  ]
}
