const fs = require('fs');
const path = require('path');
require('dotenv').config();

class ConfigManager {
    constructor() {
        const environment = process.env.NODE_ENV || 'dev';
        const configPath = path.join(__dirname, `config.${environment}.json`);
        this.config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }

    get(key) {
        return this.config[key];
    }
}

const configManagerInstance = new ConfigManager();
module.exports = configManagerInstance;
