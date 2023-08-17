interface Delay {
  (ms: number): Promise<void>;
}
export const delay: Delay = async ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
