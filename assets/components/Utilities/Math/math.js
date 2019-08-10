
export default class MyMath {
  static lengthOfVector(v) {
    return Math.sqrt(Math.pow(v.x,2)+Math.pow(v.y,2));
  }

  static getSwipeAngle(gestureState) {
    let dir = { x: gestureState.dx, y: gestureState.dy };
    let horizontal = { x: 1, y: 0 };
    let dotProd = dir.x*horizontal.x + dir.y*horizontal.y;
    let lengthProd = MyMath.lengthOfVector(dir)*MyMath.lengthOfVector(horizontal);
    let cos = dotProd/lengthProd;
    return Math.acos(cos)*180/Math.PI; //Convert radian to degree
  }

  static isSwipingDown(gestureState) {
    let angle = MyMath.getSwipeAngle(gestureState);
    return gestureState.dy > 0 && ((90-angle <= 20) || (90-(180-angle) <= 20));
  }

}
