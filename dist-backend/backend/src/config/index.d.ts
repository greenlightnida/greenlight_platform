export declare const config: {
    port: string | number;
    nodeEnv: string;
    frontendUrl: string;
    database: {
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
        dialect: "postgres";
        logging: boolean;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    cors: {
        origin: string;
        credentials: boolean;
    };
    socket: {
        cors: {
            origin: string;
            methods: string[];
        };
    };
};
//# sourceMappingURL=index.d.ts.map