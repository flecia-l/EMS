const { error } = require('console');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

class ConfigManager {
    constructor() {
        const environment = process.env.NODE_ENV || 'dev';
        const configPath = path.join(__dirname, `config.${environment}.json`);
        
        try {
            this.config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }
        catch (error) {
            console.error(`Config file ${configPath} not found or not readable`, error);
        }
    }

    getConfig(key) {
        return this.config[key];
    }
    
    static getInstance() {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }
}

const configManagerInstance = ConfigManager.getInstance();
module.exports = configManagerInstance;