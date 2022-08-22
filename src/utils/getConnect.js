const regexMatchdigit = /(:?\d+s*)/gm;

export const getConnect = (grp) => {
  let array = [];
  for (let i = 0; i < grp.length; i++) {
    array.push(grp[i][1]?.match(regexMatchdigit));
  }
  return array;
}
