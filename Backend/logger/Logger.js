const winston = require('winston');
require('dotenv').config();

class Logger {
    constructor() {
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.json(),
            transports: [
                // 配置日志文件输出
                new winston.transports.File({ filename: 'error.log', level: 'error' }),
                new winston.transports.File({ filename: 'combined.log' }),
            ],
        });

        // 如果不是生产环境，还要在控制台输出日志
        if (process.env.NODE_ENV !== 'pro') {
            this.logger.add(new winston.transports.Console({
                format: winston.format.simple(),
            }));
        }
    }    

    // 提供log和error方法，用于记录信息和错误日志
    log(message) {
        this.logger.info(message);
    }

    error(message) {
        this.logger.error(message);
    }

    static getInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }
}

const loggerInstance = Logger.getInstance();
module.exports = loggerInstance;