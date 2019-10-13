import web3 from '~/services/web3';

const LOOP_INTERVAL = 1000;

async function loop(request, condition) {
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        const response = await request();

        if (condition(response)) {
          clearInterval(interval);
          resolve(response);
        }
      } catch (error) {
        clearInterval(interval);
        reject(error);
      }
    }, LOOP_INTERVAL);
  });
}

export default async function isDeployed(address) {
  await loop(
    () => web3.eth.getCode(address),
    code => {
      return code !== '0x';
    },
  );
}
