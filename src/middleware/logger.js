const logger = (req, res, next) => {
  const zamanDamgasi = new Date().toISOString();

  // originalUrl kullanılır: router içinde req.url '/tasks' önekini kaybeder, kayıtta tam adres görünmeli.
  console.log(`[${zamanDamgasi}] ${req.method} ${req.originalUrl}`);

  // next() çağrılmazsa istek burada asılı kalır ve route'a hiç ulaşmaz.
  next();
};

module.exports = logger;
