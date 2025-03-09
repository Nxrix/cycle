class srnd {
  constructor(seed) {
    this.s = seed;
    this.d = 0xFFFFFFFF;
    this.u = 1664525;
    this.a = 1013904223;
  }
  gen() {
    this.s=(this.s*this.u+this.a)%this.d;
    return this.s/this.d;
  }
}

class frnd {
  constructor() {
    this.t = 0;
  }
  fh(n,f=2) {
    return (n^(n%2)^(n%3)^(n%5)^(n%7)^(n%11)^(n%13)^(n%17)^(n%19)^(n%27)^(n%29))%f/(f-1);
  }
  gen(n) {
    this.t++;
    return this.fh(n+this.t,32);
  }
  gen1(v,n=32) {
    this.t = 0;
    let bin = "";
    const nd = Math.ceil(Math.log2(n+1));
    for (let i=0;i<nd;i++) {
      bin += this.gen(v);
    }
    return parseInt(bin,2)%(n+1);
  }
}

const get_grid = (x,y) => {
  return (x>=0&&x<h&&y>=0&&y<w)?1:0;
}

const init_tile = (x,y) => {
  return [get_grid(x+1,y),get_grid(x,y+1),get_grid(x-1,y),get_grid(x,y-1)];
}

const tiles_connected = () => {
  for (let i=0;i<h;i++) {
    for (let j=0;j<w;j++) {
      const index = i+j*h;
      const tile = tiles[index];
      if (tile[0]==1&&i+1==h) return false;
      if (tile[1]==1&&j+1==w) return false;
      if (tile[2]==1&&i-1==-1) return false;
      if (tile[3]==1&&j-1==-1) return false;
      if (tile[0]==1&&i+1<h) {
        if (tiles[i+1+j*h][2]!=1) {
          return false;
        }
      }
      if (tile[1]==1&&j+1<w) {
        if (tiles[i+(j+1)*h][3]!=1) {
          return false;
        }
      }
      if (tile[2]==1&&i-1>=0) {
        if (tiles[i-1+j*h][0]!=1) {
          return false;
        }
      }
      if (tile[3]==1&&j-1>=0) {
        if (tiles[i+(j-1)*h][1]!=1) {
          return false;
        }
      }
    }
  }
  return true;
}

const connections = (arr) => {
  let t = 0;
  for (const sub of arr) {
    for (const value of sub) {
      if (value === 1) {
        t++;
      }
    }
  }
  return t;
}

const connections_rate = (arr) => {
  let counts = [0,0,0,0,0];
  arr.forEach(a => {
    counts[a.filter(n=>n==1).length]++;
  });
  return counts;
}

const remove_connections = (seed,probability) => {
  const rnd = new frnd();
  for (let i=0;i<h;i++) {
    for (let j=0;j<w;j++) {
      const index = i+j*h;
      const tile = tiles[index];
      for (let dir = 0; dir < 4; dir++) {
        if (rnd.gen(seed)<probability) {
          tile[dir] = 0;
          if (dir == 0 && i + 1 < h) {
            tiles[(i + 1) + j * h][2] = 0;
          } else if (dir == 1 && j + 1 < w) {
            tiles[i + (j + 1) * h][3] = 0;
          } else if (dir == 2 && i - 1 >= 0) {
            tiles[(i - 1) + j * h][0] = 0;
          } else if (dir == 3 && j - 1 >= 0) {
            tiles[i + (j - 1) * h][1] = 0;
          }
        }
      }
    }
  }
}

const rot = (x,y,s,n) => {
  const c = s/2-0.5;
  let tx = x-c;
  let ty = y-c;
  for (let i=0;i<n;i++) {
    const tmx = tx;
    tx = -ty;
    ty = tmx;
  }
  return [tx+c,ty+c];
}

const remove_connections4 = (seed,probability) => {
  const rnd = new frnd();
  for (let i=0;i<h/2;i++) {
    for (let j=0;j<w/2;j++) {
      for (let dir=0;dir<4;dir++) {
        if (rnd.gen(seed)<probability) {
          for (let k=0;k<4;k++) {
            let [x,y] = rot(i,j,h,k);
            let d = (dir+k)%4;
            tiles[x+y*h][d] = 0;
            if (d==0&&x+1<h) {
              tiles[(x+1)+y*h][2] = 0;
            } else if (d==1&&y+1<w) {
              tiles[x+(y+1)*h][3] = 0;
            } else if (d==2&&x-1>=0) {
              tiles[(x-1)+y*h][0] = 0;
            } else if (d==3&&y-1>=0) {
              tiles[x+(y-1)*h][1] = 0;
            }
          }
        }
      }
    }
  }
}

const remove_connections2 = (seed,probability) => {
  const rnd = new frnd();
  for (let i=0;i<h;i++) {
    for (let j=0;j<w/2;j++) {
      for (let dir=0;dir<4;dir++) {
        if (rnd.gen(seed)<probability) {
          let [x,y] = [i,j];
          let d = dir;
          tiles[x+y*h][d] = 0;
          if (d==0&&x+1<h) {
            tiles[(x+1)+y*h][2] = 0;
          } else if (d==1&&y+1<w) {
            tiles[x+(y+1)*h][3] = 0;
          } else if (d==2&&x-1>=0) {
            tiles[(x-1)+y*h][0] = 0;
          } else if (d==3&&y-1>=0) {
            tiles[x+(y-1)*h][1] = 0;
          }
          [x,y] = [i,w-j-1];
          if (dir==1) d=3;
          if (dir==3) d=1;
          tiles[x+y*h][d] = 0;
          if (d==0&&x+1<h) {
            tiles[(x+1)+y*h][2] = 0;
          } else if (d==1&&y+1<w) {
            tiles[x+(y+1)*h][3] = 0;
          } else if (d==2&&x-1>=0) {
            tiles[(x-1)+y*h][0] = 0;
          } else if (d==3&&y-1>=0) {
            tiles[x+(y-1)*h][1] = 0;
          }
        }
      }
    }
  }
}

const countc = (a) => {
  return a.filter(n=>n==1).length;
}

const fix_tiles2 = () => {
  for (let i = 0; i < h; i++) {
    for (let j = 0; j < w; j++) {
      const index = i + j * h;
      const tile = tiles[index];
      let connections = [];
      for (let dir = 0; dir < 4; dir++) {
        if (tile[dir] === 1) {
          connections.push(dir);
        }
      }
      if (connections.length === 1) {
        const dir = connections[0];
        let neighborIndex;
        if (dir === 0 && i + 1 < h) {
          neighborIndex = (i + 1) + j * h;
        } else if (dir === 1 && j + 1 < w) {
          neighborIndex = i + (j + 1) * h;
        } else if (dir === 2 && i - 1 >= 0) {
          neighborIndex = (i - 1) + j * h;
        } else if (dir === 3 && j - 1 >= 0) {
          neighborIndex = i + (j - 1) * h;
        }
        if (neighborIndex !== undefined) {
          const neighborTile = tiles[neighborIndex];
          const neighborConnections = [];
          for (let neighborDir = 0; neighborDir < 4; neighborDir++) {
            if (neighborTile[neighborDir] == 1) {
              neighborConnections.push(neighborDir);
            }
          }
          if (neighborConnections.length == 1) {
            const neighborDir = neighborConnections[0];
            tile[dir] = 0;
            neighborTile[neighborDir] = 0;
          }
        }
      }
    }
  }
}

const fix_tiles = () => {
  for (let i = 0; i < h; i++) {
    for (let j = 0; j < w; j++) {
      const index = i + j * h;
      const tile = tiles[index];
      const connections = tile.reduce((acc, val) => acc + val, 0);
      if (connections === 1) {
        let connectedTileIndex = null;

        if (tile[0] === 1 && i + 1 < h) {
          connectedTileIndex = (i + 1) + j * h;
        } else if (tile[1] === 1 && j + 1 < w) {
          connectedTileIndex = i + (j + 1) * h;
        } else if (tile[2] === 1 && i - 1 >= 0) {
          connectedTileIndex = (i - 1) + j * h;
        } else if (tile[3] === 1 && j - 1 >= 0) {
          connectedTileIndex = i + (j - 1) * h;
        }
        if (connectedTileIndex !== null) {
          const connectedTile = tiles[connectedTileIndex];
          const connectedConnections = connectedTile.reduce((acc, val) => acc + val, 0);
          if (connectedConnections === 1) {
            const neighbors = [
              { x: i + 1, y: j },
              { x: i - 1, y: j },
              { x: i, y: j + 1 },
              { x: i, y: j - 1 }
            ];
            let hasMoreThanOneConnection = false;
            for (const { x, y } of neighbors) {
              if (x >= 0 && x < h && y >= 0 && y < w) {
                const neighborTile = tiles[x+y*h];
                const neighborConnections = neighborTile.reduce((acc, val) => acc + val, 0);
                if (neighborConnections>1) {
                  hasMoreThanOneConnection = true;
                  break;
                }
              }
            }
            if (!hasMoreThanOneConnection) {
              tiles[index] = [0,0,0,0];
              tiles[connectedTileIndex] = [0,0,0,0];
            }
          }
        }
      }
    }
  }
}

const gen_level = (t,seed,p,stp,g=0) => {
  for (let i=0;i<h;i++) {
    for (let j=0;j<w;j++) {
      tiles[i+j*h] = init_tile(i,j);
    }
  }
  switch (t) {
    case 0:
      remove_connections(seed,p);
      break;
    case 1:
      remove_connections2(seed,p);
      break;
    case 2:
      remove_connections4(seed,p);
      break;
  }
  fix_tiles();
  const v = w*h*4-2*(w+h);
  const c = connections(tiles);
  //const cr = connections_rate(tiles);
  //const cs = cr[1]+cr[2]+cr[3]+cr[4];
  if (g<16) {
    if (c<v/3) gen_level(t,seed,p-stp,stp*1.5,g+1);
    //if (c<v/4&&h>6) gen_level(t,seed,p-stp,stp*1.5,g+1);
    if (c>v/4*3) gen_level(t,seed,p+0.25,stp/2,g+1);
    //if (c>v/4*2&&h>7) gen_level(t,seed,p+0.25,stp/2,g+1);
    if (c==v) gen_level(t,seed,p+0.25,stp/2,g+1);
  }
}