import mysql2 from "mysql2";

export const mysqlConnection = () => {
  return new Promise<mysql2.Connection>((resolve, reject) => {
    const connection = mysql2.createConnection({
			host: process.env.DATABASE_HOST || 'localhost',
			port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : 3306,
			user: process.env.DATABASE_USERNAME || 'root',
			password: process.env.DATABASE_PASSWORD || '',
			database: process.env.DATABASE_TABLE || '',
		});

    connection.connect((err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(connection);
    });
  });
};
