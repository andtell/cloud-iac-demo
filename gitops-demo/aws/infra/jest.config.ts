// import type { Config } from "@jest/types";

// const config: Config.InitialOptions = {
//     preset: "ts-jest",
// };

// export default config;



import type {Config} from '@jest/types';
// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  transform: {
  '^.+\\.tsx?$': 'ts-jest',
  },
};
export default config;