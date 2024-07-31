(function () {

  //windowサイズを画面サイズに合わせる
  var width = window.innerWidth;
  var height = window.innerHeight;

  var element;
  var scene, camera, renderer, controls, texture;

  function init() {

    // シーンの作成
    scene = new THREE.Scene();

    // リサイズイベントを検知してリサイズ処理を実行
    window.addEventListener("resize", handleResize, false);

    // カメラの作成
    camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
    camera.position.set(0, 0, 0.1);
    scene.add(camera);

    // 球体の形状を作成
    var geometry = new THREE.SphereGeometry(5, 60, 40);
    geometry.scale(-1, 1, 1);

    // 動画の読み込み
    var video = document.createElement("video");
    video.src = "../common/videos/video.mp4";
    video.load();
    video.play();
    video.loop = true;

    //テクスチャーにvideoを設定
    texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;

    //マテリアルの作成
    var material = new THREE.MeshBasicMaterial({
      // 画像をテクスチャとして読み込み
      map: texture
    });

    // 球体(形状)にマテリアル(質感)を貼り付けて物体を作成
    sphere = new THREE.Mesh(geometry, material);

    //シーンに追加
    scene.add(sphere);

    // レンダラーの作成
    renderer = new THREE.WebGLRenderer();
    // レンダラーをwindowサイズに合わせる
    renderer.setSize(width, height);
    renderer.setClearColor({color: 0x000000});
    element = renderer.domElement;
    document.getElementById("stage").appendChild(element);
    renderer.render(scene, camera);

    // デバイスの判別
    var isAndroid = false;
    var isIOS = false;
    if (navigator.userAgent.indexOf("Android") != -1) {
      //　デバイスがAndroidの場合
      isAndroid = true;
    } else if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent)) {
      //　デバイスがiOSの場合
      isIOS = true;
    }
    if (isAndroid || isIOS) {
      // デバイスがスマートフォンまたはタブレット端末の場合
      // ジャイロセンサーで視点操作を可能にする
      window.addEventListener("deviceorientation", setOrientationControls, true);
    } else {
      // パソコンの場合
      // マウスドラッグで視点操作を可能にする
      setOrbitControls();
    }

    render();
  }

  // リサイズ処理
  function handleResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }

  function setOrbitControls() {
    // パソコン閲覧時マウスドラッグで視点操作する
    controls = new THREE.OrbitControls(camera, element);
    controls.target.set(
      camera.position.x + 0.15,
      camera.position.y,
      camera.position.z
    );
    // 視点操作のイージングをONにする
    controls.enableDamping = true;
    // 視点操作のイージングの値
    controls.dampingFactor = 0.2;
    // 視点変更の速さ
    controls.rotateSpeed = 0.1;
    // ズーム禁止
    controls.noZoom = true;
    // パン操作禁止
    controls.noPan = true;
  }

  // ジャイロセンサーで視点操作する
  function setOrientationControls(e) {
    // スマートフォン以外で処理させない
    if (!e.alpha) {
      return;
    }
    controls = new THREE.DeviceOrientationControls(camera, true);
    controls.connect();
    controls.update();
    window.removeEventListener("deviceorientation", setOrientationControls, true);
  }

  function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    controls.update();
  }

  window.addEventListener("load", init, false);

})();