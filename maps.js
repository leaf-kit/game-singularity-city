/* ════════════════════════════════════════════════════════════════════════
   싱귤래리티 시티 (SINGULARITY CITY) — 맵 데이터
   ────────────────────────────────────────────────────────────────────────
   index.html 의 엔진과 완전히 분리된 순수 데이터 파일이다.
   맵을 추가하거나 랜드마크 실루엣을 고칠 때는 이 파일만 건드리면 된다.
   (일반 스크립트로 로드하므로 file:// 로 열어도 동작한다 — 모듈 아님)

   ── 좌표계 ─────────────────────────────────────────────────────────────
     x   월드 가로. 도심 코어 중심이 0. 단위 = 미터.
     y   월드 세로. 지면(해수면/빙면)이 0, 위로 갈수록 음수. 단위 = 미터.
         예) 롯데월드타워 555m → y = -555
     d   깊이(depth) 0 = 화면 최전면, 1 = 지평선. 원근 축소·안개·시차에 쓰인다.
         랜드마크는 보통 0.55~0.95(배경), 플레이어 타워 부지는 0.10~0.70.

   ── 도시 건축 성향(style) ──────────────────────────────────────────────
     맵마다 서는 마천루의 성격을 정한다. 값은 "가중치 배수"이며 생략하면 1.
       shapes   실루엣 선호도  (slab/taper/needle/deco/ziggurat/obelisk/stack/
                               twist/helix/spindle/pylon/notch/lean/crossbox/
                               bundle/chamfer/buttress/sail/mesa/drum/terrace/
                               shard/bowtie/jenga/pagoda/fin/barrel/cantile/
                               arcology/twin/module)
       facades  파사드 선호도  (curtain/grid/masonry/ribbed/banded/diagrid/
                               panel/checker/louver/balcony/porthole/mosaic/
                               stripe/bay/chevron/lattice/vine)
       zones    용도 선호도    (office/resi/civic/retail/indus/data/farm/lab)
       crowns   옥상 마감 후보 배열
       body     외벽 기본색 — 도시의 살색이다. 모든 건물 색이 여기로 당겨진다
       palette  외벽 후보색 배열 — 건물마다 이 중 하나에서 출발한다
       hueVar   건물별 색상환 회전 폭(도). 크면 개성이, 작으면 통일감이 선다
       cohere   도시 살색으로 되당기는 비율(0~1). 크면 한 덩어리로 보인다
       green    도시 기본 녹화율(0~1) — 외벽·옥상 식재의 바탕값
       solar    옥상 태양광 확률(0~1)
       greenhouse  1 이면 저층에 유리 온실이 붙는다 (극지·사막)
       podium   저층 기단이 생길 확률 (0~1)
       glassK   유리 반사 강도 배수

   ── 식생(flora) ────────────────────────────────────────────────────────
     지면에 심기는 나무·관목·화단. 생략하면 climate 기본값을 쓴다.
       kinds    ['broadleaf','conifer','palm','shrub','planter','greenhouse']
       weights  kinds 와 같은 길이의 가중치 배열
       h        기준 수고(m) · density 밀도 배수 · tint 잎 색

   ── 그 밖의 맵 옵션 ────────────────────────────────────────────────────
       village    1 이면 마천루 대신 통나무집이 선다
       xmas       1 이면 산타 썰매 · 색전구 · 리스가 붙는다
       snow       0.3 이상이면 오두막 지붕에 눈이 쌓인다
       fireflies  밤에 지면을 떠다니는 반딧불 밀도 (0~1.5)
       traffic    {sim, car, air} 교통량 배수 — 조용한 부지는 낮게 둔다

   ── 랜드마크 파츠(parts) 프리미티브 ────────────────────────────────────
     엔진의 제너릭 렌더러가 해석하는 도형 조각들. 각 파츠의 좌표는
     "랜드마크 로컬 원점(x=0, 지면 y=0)" 기준이며 scale 이 곱해진다.

     taper    {y0,y1,w0,w1,win,lean,tint}   사다리꼴 몸통 (y0=아래, y1=위)
     box      {y0,y1,w,win,tint}            직육면체 몸통
     spire    {y0,y1,w0,w1}                 첨탑
     mast     {y0,y1,w}                     가느다란 안테나 기둥
     deck     {y,w,h,tint}                  전망대 슬래브
     lattice  {y0,y1,w0,w1,bands,legs}      철골 격자탑 (에펠·도쿄타워·N서울)
     arch     {y0,y1,w,th}                  아치문 (개선문)
     dome     {y,r,w}                       돔 지붕
     sphere   {y,r}                         구체
     ring     {y,r,th,tilt}                 기울어진 고리 (트로제나)
     statue   {y0,h}                        입상 실루엣 (자유의 여신상)
     wall     {y0,y1,w,mirror}              거울 장벽 (네옴 더 라인)
     mount    {y0,w,h,snow}                 산 능선
     berg     {y0,w,h,seed}                 빙산
     dish     {y,r}                         파라볼라 안테나
     hut      {y,w,h,tint}                  기지 막사
     ship     {y,w,h}                       쇄빙선
     bridge   {y,w,style}                   교량 (suspension | cable | arch)
     stadium  {y,w,h}                       경기장 지붕
     crown    {y0,y1,w,rays}                크라이슬러식 방사형 왕관
     lightrow {y,w,n,color}                 수평 조명 띠
     clock    {y,r,tint,frame}              시계 문자판 (빅벤) — 바늘이 실제 시각
     wheel    {y,r,cabs}                    관람차 (런던아이)
     bulb     {y0,y1,w}                     총알형 몸통 (거킨) — 다이아그리드
     broad    {y,h,w,tint,bark,lantern}     활엽수 거목 — lantern:1 이면 등불
     lamp     {y,h}                         공원 등불
     tree     {y0,h,w,tiers,star}            크리스마스 트리
                                            (lights:0 · snow:0 → 그냥 전나무)
     snowman  {y,h}                          눈사람
     candycane{y,h}                          캔디케인 가로등
     gift     {y,w,n,seed}                   선물 상자 더미

     공통 옵션:  tint(기본색 hex) · win('grid'|'band'|'sparse'|'none')
                 glow(꼭대기 발광색) · lit(야간 조명 강도 0~1)
   ════════════════════════════════════════════════════════════════════════ */

(function (root) {
  'use strict';

  /* ── 부지(lot) 생성 헬퍼 ───────────────────────────────────────────────
     초고층 위주 / 작은 면적이 이 게임의 성능 전략이다.
     한 줄(row)에 n개 부지를 x0~x1 사이에 고르게 흩뿌린다.
       d    깊이
       max  그 줄에서 자랄 수 있는 최고 높이(m)
       w    부지 폭(m) — 타워 밑면 너비의 기준
       jit  x 흔들림 비율(0~1) — 격자 느낌을 죽인다
  */
  function row(cfg) {
    const {
      d, n, x0, x1, w, max, jit = 0.34, seed = 1, zone = null,
      /* hVar/wVar — 높이·폭이 흔들리는 폭. 크게 주면 한 줄 안에서도
         층수가 제각각이 되어 스카이라인이 톱니처럼 살아난다. */
      hVar = 0.52, wVar = 0.46, spread = 0.035,
    } = cfg;
    const out = [];
    let s = seed * 9301 + 49297;
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    const span = (x1 - x0) / Math.max(1, n - 1);
    for (let i = 0; i < n; i++) {
      const base = n === 1 ? (x0 + x1) / 2 : x0 + span * i;
      out.push({
        x: base + (rnd() - 0.5) * span * jit,
        d: d + (rnd() - 0.5) * spread,
        w: w * (1 - wVar * 0.5 + rnd() * wVar),
        max: max * (1 - hVar * 0.73 + rnd() * hVar),
        seed: (seed * 131 + i * 17) | 0,
        zone,
      });
    }
    return out;
  }

  /* 군집(cluster) — 한 점을 중심으로 모여 서고, 가장자리로 갈수록 낮아진다.
     극지 기지나 항만처럼 "이유가 있어서 모여 있는" 배치에 쓴다. */
  function cluster(cfg) {
    const { d, n, xc, span, w, max, seed = 1, zone = null, falloff = 0.62, spread = 0.05 } = cfg;
    const out = [];
    let s = seed * 7919 + 104729;
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    for (let i = 0; i < n; i++) {
      /* 중심에 몰리도록 두 번 뽑아 평균낸다 */
      const u = ((rnd() + rnd()) / 2 - 0.5) * 2;
      out.push({
        x: xc + u * span,
        d: d + (rnd() - 0.5) * spread,
        w: w * (0.72 + rnd() * 0.56),
        max: max * (1 - Math.abs(u) * falloff) * (0.72 + rnd() * 0.5),
        seed: (seed * 197 + i * 23) | 0,
        zone,
      });
    }
    return out;
  }

  const lots = (...rows) => rows.flatMap(r => (Array.isArray(r) ? r : row(r)));

  /* 대부분의 도시가 공유하는 표준 코어 배치.
     앞쪽(d 작음)일수록 부지가 적고 넓다 — 시야를 가리지 않게.

     부지 개수는 맵 시드로 매번 다르게 뽑는다. 도시마다 마천루가
     아홉 채인지 열네 채인지가 달라야 스카이라인이 서로 닮지 않는다.
     거기에 "돌출 초고층"을 1~3채 섞어 도시에 확실한 주인공을 만든다. */
  const CORE = (seed, hi, opt) => {
    const o = opt || {};
    let s = (seed * 2777 + 13) | 0;
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    const pick = (a, b) => a + Math.round(rnd() * (b - a));
    const k = o.k != null ? o.k : 1;          // 전체 부지 개수 배수
    const rows = [
      /* 코어 — 도시에서 가장 높은 켜 */
      { d: 0.70, n: Math.round(pick(8, 13) * k), x0: -2700, x1: 2700, w: 275, max: hi * 0.70, seed: seed + 1, hVar: .70 },
      { d: 0.58, n: Math.round(pick(6, 11) * k), x0: -2400, x1: 2400, w: 305, max: hi * 0.88, seed: seed + 2, hVar: .78 },
      { d: 0.46, n: Math.round(pick(5, 9) * k),  x0: -2050, x1: 2050, w: 345, max: hi * 1.00, seed: seed + 3, hVar: .84 },
      { d: 0.35, n: Math.round(pick(4, 8) * k),  x0: -1750, x1: 1750, w: 395, max: hi * 0.70, seed: seed + 4, hVar: .76 },
      /* 납작한 중층 — 폭은 넓고 높이는 낮다 */
      { d: 0.25, n: Math.round(pick(4, 7) * k),  x0: -1500, x1: 1500, w: 490, max: hi * 0.30, seed: seed + 5, hVar: .66 },
      /* 저층 켜 — 도시의 바닥을 채운다. 여기가 두꺼워야 도시가 땅에 앉는다 */
      { d: 0.16, n: Math.round(pick(6, 11) * k), x0: -1350, x1: 1350, w: 330, max: hi * 0.12, seed: seed + 6, jit: .55, hVar: .8 },
      { d: 0.07, n: Math.round(pick(7, 12) * k), x0: -1150, x1: 1150, w: 285, max: hi * 0.055, seed: seed + 7, jit: .6, hVar: .85 },
    ];
    const out = rows.flatMap(row);
    /* 주인공 — 주변보다 머리 하나가 더 솟는 초고층 몇 채 */
    const nHero = pick(1, 3);
    for (let i = 0; i < nHero; i++) {
      out.push({
        x: (rnd() - 0.5) * 3400,
        d: 0.40 + rnd() * 0.22,
        w: 330 + rnd() * 160,
        max: hi * (1.02 + rnd() * 0.20),
        seed: (seed * 313 + i * 71 + 5) | 0,
        zone: o.heroZone || null,
      });
    }
    return out;
  };

  /* ════════════════════════════════════════════════════════════════════
     맵 정의
     ════════════════════════════════════════════════════════════════════ */
  const MAPS = {

    /* ─────────────────────────────────────────────────────────────────
       잠실 — 한강 위의 첫 수직도시
       ───────────────────────────────────────────────────────────────── */
    jamsil: {
      name: '잠실',
      en: 'JAMSIL · SEOUL',
      emoji: '🇰🇷',
      tagline: '한강 위에 세워진 최초의 AGI 수직도시.',
      hint: '롯데월드타워 555m가 새 마천루의 발목에 닿는다. 밤이면 한강이 도시를 두 번 비춘다.',
      cityDefault: '뉴 잠실',
      lat: 37.5,
      climate: 'temperate',
      ground: {
        type: 'river',        // 강이 도심을 가로지른다
        color: [26, 30, 40],
        water: { d0: 0.0, d1: 0.78, color: [12, 22, 38], reflect: 0.62 },
      },
      sky: { hazeK: 1.0, tintDay: [188, 208, 228], tintNight: [22, 30, 52], pollution: 0.22 },
      aurora: 0, snow: 0, rainOdds: 0.18,
      /* 서울세계불꽃축제 — 해가 지면 한강 위로 셸이 올라간다 */
      festival: {
        name: '서울세계불꽃축제',
        note: '한강 위로 셸이 올라갑니다. 수면이 두 번 빛납니다.',
        x0: -2400, x1: 2400, d: 0.24, h0: 520, h1: 1100,
      },
      /* 배경 저층 시가지: {d, y(스카이라인 평균 높이 m), density, tint} */
      districts: [
        { d: 0.92, h: 70, density: 0.9, tint: [30, 38, 54] },
        { d: 0.82, h: 105, density: 0.8, tint: [34, 43, 60] },
      ],
      landmarks: [
        { id: 'lotte', name: '롯데월드타워', x: -3350, d: 0.78, scale: 1, glow: '#a8d8ff',
          parts: [
            { k: 'taper', y0: 0, y1: -496, w0: 132, w1: 46, tint: '#2b3a4d', win: 'grid', lean: 0.0 },
            { k: 'deck',  y: -478, w: 78, h: 15, tint: '#3a4c62' },
            { k: 'spire', y0: -496, y1: -555, w0: 40, w1: 5 },
            { k: 'beacon', y: -557, r: 3.4, color: '#ff5f4a', blink: 1.7 },
          ] },
        { id: 'nseoul', name: 'N서울타워', x: 3450, d: 0.88, scale: 1,
          /* 남산(243m) 위에 얹힌다 — mount 파츠가 받침 역할 */
          parts: [
            { k: 'mount', y0: 0, w: 1500, h: 243, snow: 0, tint: '#1e2a34' },
            { k: 'lattice', y0: -243, y1: -400, w0: 62, w1: 22, bands: 5, legs: 4 },
            { k: 'deck', y: -400, w: 58, h: 26, tint: '#42505f' },
            { k: 'deck', y: -422, w: 44, h: 14, tint: '#4c5b6b' },
            { k: 'mast', y0: -430, y1: -479, w: 6 },
            { k: 'beacon', y: -481, r: 3, color: '#7fe1ff', blink: 2.4 },
          ] },
        { id: 'bldg63', name: '63빌딩', x: -4400, d: 0.9, scale: 1, glow: '#ffd79a',
          parts: [
            { k: 'taper', y0: 0, y1: -249, w0: 70, w1: 52, tint: '#3b3a2e', win: 'band', lean: 0.05 },
            { k: 'beacon', y: -252, r: 2.2, color: '#ff8a5a', blink: 2.1 },
          ] },
        { id: 'stadium', name: '잠실 주경기장', x: 1500, d: 0.94, scale: 1,
          parts: [{ k: 'stadium', y: 0, w: 420, h: 58, tint: '#2c3442' }] },
        { id: 'olympic', name: '올림픽대교', x: -620, d: 0.16, scale: 1,
          parts: [{ k: 'bridge', y: 0, w: 2600, style: 'cable', tint: '#232b38' }] },
      ],
      /* 한강변 신도시 — 유리 커튼월이 주류, 비틀린 실루엣이 섞인다.
         한강 조망을 파는 도시라 주거 비중이 높고, 발코니가 많다 */
      style: {
        shapes: { slab: 1.4, taper: 1.3, twist: 1.6, helix: 1.4, needle: 1.2, deco: .7, ziggurat: .6,
                  terrace: 1.8, shard: 1.5, chamfer: 1.3, twin: 1.3, jenga: 1.2, module: 1.1, drum: .8 },
        facades: { curtain: 2.4, grid: 1.4, banded: 1.0, ribbed: .7, masonry: .3,
                   balcony: 2.2, bay: 1.3, stripe: 1.2, mosaic: 1.0, vine: 1.2, louver: .5, porthole: .3 },
        zones: { resi: 1.5, office: 1.2, retail: 1.1, farm: .8, data: .7, lab: .8, indus: .5 },
        crowns: ['blade', 'spike', 'flat', 'antenna', 'garden'],
        palette: ['#2b3543', '#344055', '#27404e', '#3a3f4a', '#2f4a52', '#42485a', '#26414a'],
        body: '#2b3543', podium: .5, glassK: 1.2,
        hueVar: 18, cohere: .22, green: .46, solar: .38,
      },
      /* 한강변 가로수 — 벚나무와 은행나무가 강을 따라 줄지어 선다 */
      flora: { kinds: ['broadleaf', 'shrub', 'planter', 'conifer'], weights: [3.4, 1.6, 1.4, .8], h: 13, density: 1.25, tint: '#43804d' },
      lots: CORE(11, 3200),
      facts: [
        '한강 수위가 올라가도 코어는 젖지 않습니다.',
        '지하 40층까지가 냉각수 순환층입니다.',
        '석촌호수는 도시의 열교환기가 되었습니다.',
      ],
    },

    /* ─────────────────────────────────────────────────────────────────
       뉴욕 — 옛 마천루의 도시 위에
       ───────────────────────────────────────────────────────────────── */
    newyork: {
      name: '뉴욕',
      en: 'NEW YORK · MANHATTAN',
      emoji: '🗽',
      tagline: '마천루의 고향이 다시 한번 하늘을 올려붙인다.',
      hint: '엠파이어스테이트·크라이슬러가 발치에 서고, 항구에서 자유의 여신상이 올려다본다.',
      cityDefault: '뉴 맨해튼',
      lat: 40.7,
      climate: 'temperate',
      ground: { type: 'bay', color: [24, 26, 34], water: { d0: 0.0, d1: 0.80, color: [10, 18, 30], reflect: 0.58 } },
      sky: { hazeK: 1.08, tintDay: [196, 206, 222], tintNight: [26, 30, 48], pollution: 0.3 },
      aurora: 0, snow: 0.1, rainOdds: 0.22,
      districts: [
        { d: 0.93, h: 120, density: 0.96, tint: [28, 32, 44] },
        { d: 0.84, h: 165, density: 0.88, tint: [33, 38, 52] },
      ],
      landmarks: [
        { id: 'empire', name: '엠파이어 스테이트 빌딩', x: -3250, d: 0.8, scale: 1, glow: '#ffd489',
          parts: [
            { k: 'box',   y0: 0, y1: -62, w: 150, tint: '#37384a', win: 'grid' },
            { k: 'taper', y0: -62, y1: -205, w0: 110, w1: 86, tint: '#3c3d50', win: 'grid' },
            { k: 'taper', y0: -205, y1: -318, w0: 66, w1: 50, tint: '#41425a', win: 'grid' },
            { k: 'deck',  y: -320, w: 56, h: 12, tint: '#4a4b63' },
            { k: 'mast',  y0: -330, y1: -443, w: 9 },
            { k: 'beacon', y: -445, r: 3, color: '#ff6a4a', blink: 1.5 },
          ] },
        { id: 'chrysler', name: '크라이슬러 빌딩', x: -4350, d: 0.86, scale: 1, glow: '#ffe6ae',
          parts: [
            { k: 'taper', y0: 0, y1: -220, w0: 78, w1: 56, tint: '#3a3a46', win: 'grid' },
            { k: 'crown', y0: -220, y1: -282, w: 56, rays: 6 },
            { k: 'mast',  y0: -282, y1: -319, w: 5 },
            { k: 'beacon', y: -321, r: 2.4, color: '#ffd06a', blink: 2.6 },
          ] },
        { id: 'wtc', name: '원 월드 트레이드 센터', x: 3300, d: 0.82, scale: 1, glow: '#bfe4ff',
          parts: [
            { k: 'taper', y0: 0, y1: -417, w0: 62, w1: 58, tint: '#2f3c4e', win: 'grid' },
            { k: 'mast',  y0: -417, y1: -541, w: 7 },
            { k: 'beacon', y: -543, r: 3.2, color: '#8fd4ff', blink: 1.9 },
          ] },
        { id: 'liberty', name: '자유의 여신상', x: 2950, d: 0.46, scale: 1.5, glow: '#9fe0c4',
          parts: [
            { k: 'box', y0: 0, y1: -47, w: 48, tint: '#2a2f38' },
            { k: 'statue', y0: -47, h: 46 },
          ] },
        { id: 'brooklyn', name: '브루클린 브리지', x: 400, d: 0.14, scale: 1,
          parts: [{ k: 'bridge', y: 0, w: 2800, style: 'suspension', tint: '#27242a' }] },
      ],
      /* 아르데코의 고향 — 셋백과 석조 파사드가 도시의 문법이다.
         돌로 지은 도시라 색은 좁게 묶고(hueVar 낮음) 형태로 변화를 준다 */
      style: {
        shapes: { deco: 3.2, ziggurat: 2.6, stack: 2.2, slab: 1.4, obelisk: 1.2, twist: .4, helix: .3,
                  bundle: 2.0, buttress: 1.6, chamfer: 1.4, twin: 1.4, pagoda: 1.1, terrace: 1.2, cantile: 1.0, drum: .9 },
        facades: { masonry: 2.6, ribbed: 1.8, grid: 1.2, curtain: .7, banded: .5,
                   lattice: 1.8, porthole: 1.0, bay: 1.2, stripe: 1.0, chevron: .8, balcony: 1.0, vine: .9 },
        zones: { office: 1.4, civic: 1.4, resi: 1.1, retail: 1.0, indus: .7, data: .9, lab: .9, farm: .6 },
        crowns: ['deco', 'pyramid', 'spike', 'tank', 'antenna'],
        palette: ['#4a4338', '#5a4a3c', '#3d3a34', '#4e4236', '#37343a', '#5c5044', '#554438'],
        body: '#3a3630', podium: .85, glassK: .7,
        hueVar: 12, cohere: .30, green: .34, solar: .26,
      },
      /* 센트럴파크의 문법 — 느티나무 열주와 관목 화단 */
      flora: { kinds: ['broadleaf', 'planter', 'shrub'], weights: [3.6, 1.6, 1.4], h: 14, density: 1.1, tint: '#3d7346' },
      lots: CORE(23, 3400),
      facts: [
        '격자 도로는 그대로 두고, 높이만 100배로 올렸습니다.',
        '허드슨 강물로 코어 전체를 식힙니다.',
        '엘리베이터가 아니라 수직 지하철이라고 불러야 합니다.',
      ],
    },

    /* ─────────────────────────────────────────────────────────────────
       파리 — 높이 제한을 마침내 풀어버린 도시
       ───────────────────────────────────────────────────────────────── */
    paris: {
      name: '파리',
      en: 'PARIS · ÎLE-DE-FRANCE',
      emoji: '🗼',
      tagline: '37m 높이 제한이 풀린 날, 파리는 수직으로 자랐다.',
      hint: '에펠탑이 기준점으로 남고 새 탑들은 그 곁에서 자란다. 석회암빛 저층이 바닥에 깔린다.',
      cityDefault: '누벨 파리',
      lat: 48.9,
      climate: 'temperate',
      ground: { type: 'river', color: [38, 36, 34], water: { d0: 0.0, d1: 0.74, color: [20, 24, 30], reflect: 0.54 } },
      sky: { hazeK: 1.14, tintDay: [212, 206, 196], tintNight: [34, 30, 44], pollution: 0.18 },
      aurora: 0, snow: 0, rainOdds: 0.3,
      districts: [
        { d: 0.94, h: 38, density: 0.98, tint: [58, 52, 46] },
        { d: 0.86, h: 46, density: 0.94, tint: [64, 58, 50] },
      ],
      landmarks: [
        { id: 'eiffel', name: '에펠탑', x: -3300, d: 0.76, scale: 1, glow: '#ffcf86',
          parts: [
            { k: 'lattice', y0: 0, y1: -116, w0: 250, w1: 96, bands: 3, legs: 4, archy: 1 },
            { k: 'deck', y: -116, w: 104, h: 12, tint: '#4a4038' },
            { k: 'lattice', y0: -116, y1: -276, w0: 88, w1: 38, bands: 4, legs: 4 },
            { k: 'deck', y: -276, w: 42, h: 10, tint: '#4a4038' },
            { k: 'lattice', y0: -276, y1: -300, w0: 34, w1: 18, bands: 2, legs: 4 },
            { k: 'mast', y0: -300, y1: -330, w: 5 },
            { k: 'beacon', y: -332, r: 3, color: '#ffd27a', blink: 2.0 },
          ] },
        { id: 'arc', name: '개선문', x: 3150, d: 0.9, scale: 1, glow: '#ffe0a8',
          parts: [{ k: 'arch', y0: 0, y1: -50, w: 45, th: 13, tint: '#5a5044' }] },
        { id: 'sacre', name: '사크레쾨르', x: 4400, d: 0.92, scale: 1,
          parts: [
            { k: 'mount', y0: 0, w: 900, h: 130, snow: 0, tint: '#2a2822' },
            { k: 'box', y0: -130, y1: -160, w: 74, tint: '#6a6152' },
            { k: 'dome', y: -160, r: 26, w: 34 },
            { k: 'dome', y: -158, r: 12, w: 16, off: -36 },
            { k: 'dome', y: -158, r: 12, w: 16, off: 36 },
          ] },
        { id: 'montp', name: '몽파르나스 타워', x: -4500, d: 0.88, scale: 1, glow: '#8fb6d8',
          parts: [{ k: 'box', y0: 0, y1: -210, w: 88, tint: '#2c2f36', win: 'grid' },
                  { k: 'beacon', y: -213, r: 2.2, color: '#ff7a5a', blink: 2.2 }] },
        { id: 'seine', name: '센 강', x: -200, d: 0.15, scale: 1,
          parts: [{ k: 'bridge', y: 0, w: 2200, style: 'arch', tint: '#3a352e' }] },
      ],
      /* 석회암의 도시 — 수직 리브와 낮은 채도, 옥상 정원.
         도시 전체가 정원을 품는 쪽으로 자랐다 — 녹화율이 가장 높은 맵 */
      style: {
        shapes: { slab: 1.8, deco: 1.6, ziggurat: 1.4, taper: 1.2, stack: 1.2, needle: .5,
                  terrace: 2.6, mesa: 1.6, buttress: 1.5, drum: 1.4, arcology: 1.3, pagoda: 1.2, barrel: 1.0 },
        facades: { ribbed: 2.4, masonry: 2.2, grid: 1.2, banded: .8, curtain: .5,
                   vine: 2.6, balcony: 1.8, lattice: 1.6, bay: 1.2, mosaic: 1.0, porthole: .7 },
        zones: { civic: 1.5, resi: 1.4, farm: 1.8, office: 1.0, retail: 1.0, lab: .9, data: .6, indus: .4 },
        crowns: ['garden', 'deco', 'dome', 'flat', 'tank'],
        palette: ['#5a5244', '#665c4a', '#4e4a3e', '#6b6050', '#57503f', '#60553f'],
        body: '#4a4438', podium: .9, glassK: .8,
        hueVar: 14, cohere: .28, green: .58, solar: .44,
      },
      /* 튈르리의 마로니에 열주 — 도시 전체가 공원 위에 앉았다 */
      flora: { kinds: ['broadleaf', 'planter', 'shrub', 'conifer'], weights: [3.8, 2.2, 1.6, .6], h: 15, density: 1.6, tint: '#477f4c' },
      lots: CORE(37, 1450),
      facts: [
        '오스만 양식 파사드를 1200m까지 복사해 올렸습니다.',
        '지붕마다 정원이 있습니다. 전부 합치면 뤽상부르 공원 80개.',
        '에펠탑은 이제 도시의 로비 기둥입니다.',
      ],
    },

    /* ─────────────────────────────────────────────────────────────────
       런던 — 안개 속에서 높이 제한을 지운 도시
       ───────────────────────────────────────────────────────────────── */
    london: {
      name: '런던',
      en: 'LONDON · THAMES',
      emoji: '🎡',
      tagline: '안개가 가장 짙은 부지. 빅벤이 새 마천루의 발치에 남는다.',
      hint: '템스강 위로 빅벤·런던아이·거킨·샤드가 줄지어 섭니다. 비가 가장 자주 오는 부지.',
      cityDefault: '뉴 웨스트민스터',
      lat: 51.5,
      climate: 'temperate',
      ground: {
        type: 'river',
        color: [28, 31, 38],
        water: { d0: 0.0, d1: 0.76, color: [16, 26, 34], reflect: 0.54 },
      },
      /* 런던의 주인공은 건물이 아니라 공기다 — hazeK 를 가장 높게 */
      sky: { hazeK: 1.18, tintDay: [194, 198, 208], tintNight: [24, 27, 40], pollution: 0.26 },
      aurora: 0, snow: 0.06, rainOdds: 0.48,
      districts: [
        { d: 0.93, h: 78, density: 0.92, tint: [30, 33, 44] },
        { d: 0.84, h: 118, density: 0.84, tint: [35, 38, 50] },
      ],
      landmarks: [
        /* 엘리자베스 타워(빅벤) 96m — 국회의사당을 옆에 물린다 */
        { id: 'bigben', name: '빅벤', x: -3200, d: 0.62, scale: 1, glow: '#ffdf9a',
          parts: [
            { k: 'box',   y0: 0, y1: -58, w: 22, tint: '#5f5440', win: 'sparse' },
            { k: 'taper', y0: -58, y1: -68, w0: 26, w1: 22, tint: '#6a5c44' },
            { k: 'clock', y: -74, r: 10 },
            { k: 'box',   y0: -82, y1: -88, w: 20, tint: '#6a5c44' },
            { k: 'spire', y0: -88, y1: -96, w0: 17, w1: 1.6, tint: '#5a4c38' },
            { k: 'beacon', y: -98, r: 1.8, color: '#ffd27a', blink: 3.4 },
          ] },
        { id: 'parl', name: '웨스트민스터 궁', x: -3580, d: 0.70, scale: 1, glow: '#ffdca8',
          parts: [
            { k: 'box',   y0: 0, y1: -34, w: 300, tint: '#574e3c', win: 'grid' },
            { k: 'spire', y0: -34, y1: -66, w0: 18, w1: 2, tint: '#5f5440', off: -110 },
            { k: 'spire', y0: -34, y1: -58, w0: 14, w1: 2, tint: '#5f5440', off: 20 },
            { k: 'spire', y0: -34, y1: -50, w0: 11, w1: 2, tint: '#5f5440', off: 120 },
          ] },
        /* 런던아이 135m */
        { id: 'eye', name: '런던아이', x: 1950, d: 0.26, scale: 1, glow: '#7fd0ff',
          parts: [
            { k: 'wheel', y: -78, r: 62, cabs: 26, tint: '#93a2b4' },
          ] },
        /* 더 샤드 310m */
        { id: 'shard', name: '더 샤드', x: 3620, d: 0.68, scale: 1, glow: '#cfe6ff',
          parts: [
            { k: 'taper', y0: 0, y1: -272, w0: 74, w1: 10, tint: '#37485a', win: 'grid' },
            { k: 'spire', y0: -272, y1: -310, w0: 9, w1: 1.4 },
            { k: 'beacon', y: -312, r: 2.6, color: '#9fdcff', blink: 2.2 },
          ] },
        /* 30 세인트 메리 액스(거킨) 180m */
        { id: 'gherkin', name: '거킨', x: 3010, d: 0.78, scale: 1, glow: '#9fe0d8',
          parts: [
            { k: 'bulb', y0: 0, y1: -180, w: 58, tint: '#3a4b52' },
          ] },
        /* 세인트 폴 대성당 111m */
        { id: 'stpauls', name: '세인트 폴 대성당', x: -4350, d: 0.82, scale: 1, glow: '#ffe3b4',
          parts: [
            { k: 'box',  y0: 0, y1: -44, w: 150, tint: '#6b6252', win: 'sparse' },
            { k: 'dome', y: -44, r: 42, tint: '#74695a' },
            { k: 'spire', y0: -105, y1: -111, w0: 8, w1: 1.4, tint: '#7b7060' },
          ] },
        /* 타워브리지 — 도개교라 가운데에 고딕 탑 두 개가 선다 */
        { id: 'towerbr', name: '타워브리지', x: 300, d: 0.15, scale: 1, glow: '#ffd9a0',
          parts: [
            { k: 'bridge', y: 0, w: 2400, style: 'suspension', tint: '#2a2a33' },
            { k: 'box',   y0: 0, y1: -54, w: 26, tint: '#4a4438', win: 'sparse', off: -420 },
            { k: 'spire', y0: -54, y1: -72, w0: 22, w1: 2, tint: '#443e34', off: -420 },
            { k: 'box',   y0: 0, y1: -54, w: 26, tint: '#4a4438', win: 'sparse', off: 420 },
            { k: 'spire', y0: -54, y1: -72, w0: 22, w1: 2, tint: '#443e34', off: 420 },
          ] },
      ],
      /* 석조 저층 위에 유리 고층 — 두 시대가 한 화면에 섞인다.
         돌의 도시라 색은 좁게 묶고(hueVar 낮음) 형태로 변화를 준다 */
      style: {
        shapes: { slab: 1.6, taper: 1.4, deco: 1.4, ziggurat: 1.2, obelisk: 1.1, needle: .9,
                  shard: 2.4, sail: 1.8, chamfer: 1.6, bundle: 1.4, drum: 1.4, twin: 1.2,
                  barrel: 1.2, bowtie: 1.1, terrace: 1.3, buttress: 1.2 },
        facades: { masonry: 2.0, curtain: 1.8, diagrid: 1.8, ribbed: 1.4, grid: 1.3, banded: .9,
                   lattice: 1.6, porthole: 1.2, stripe: 1.1, bay: 1.1, mosaic: .8, balcony: 1.0, vine: 1.0 },
        zones: { office: 1.5, civic: 1.3, retail: 1.2, resi: 1.1, lab: 1.0, data: .8, farm: .8, indus: .7 },
        crowns: ['blade', 'deco', 'flat', 'spike', 'garden'],
        palette: ['#3c4250', '#4a4a44', '#33404c', '#514a40', '#3e4a4e', '#464050'],
        body: '#3b4048', podium: .78, glassK: 1.05,
        hueVar: 13, cohere: .30, green: .50, solar: .30,
      },
      /* 플라타너스 — 런던의 가로수는 거의 전부 이 나무다 */
      flora: { kinds: ['broadleaf', 'planter', 'shrub', 'conifer'], weights: [4.0, 1.8, 1.6, .5], h: 14, density: 1.3, tint: '#3c7548' },
      lots: CORE(83, 2600),
      facts: [
        '빅벤의 바늘은 도시 시계와 같은 시각을 가리킵니다.',
        '안개는 걷어내지 않습니다. 도시의 일부로 계산에 넣습니다.',
        '지하 20층부터가 옛 지하철 터널입니다.',
        '템스 배리어는 이제 도시의 기초를 겸합니다.',
      ],
    },

    /* ─────────────────────────────────────────────────────────────────
       도쿄 — 지진을 계산으로 이긴 도시
       ───────────────────────────────────────────────────────────────── */
    tokyo: {
      name: '도쿄',
      en: 'TOKYO · MINATO',
      emoji: '🗾',
      tagline: '진도 8을 실시간으로 상쇄하는 능동 제진 마천루.',
      hint: '도쿄타워와 스카이트리, 그리고 멀리 후지산. 네온 습기가 공기에 남는다.',
      cityDefault: '신 도쿄',
      lat: 35.7,
      climate: 'temperate',
      ground: { type: 'bay', color: [22, 26, 32], water: { d0: 0.0, d1: 0.80, color: [10, 20, 32], reflect: 0.62 } },
      sky: { hazeK: 1.2, tintDay: [198, 204, 214], tintNight: [24, 26, 46], pollution: 0.34 },
      aurora: 0, snow: 0, rainOdds: 0.34,
      districts: [
        { d: 0.95, h: 55, density: 1.0, tint: [28, 32, 42] },
        { d: 0.86, h: 90, density: 0.92, tint: [32, 37, 50] },
      ],
      landmarks: [
        { id: 'fuji', name: '후지산', x: -5600, d: 0.985, scale: 1,
          parts: [{ k: 'mount', y0: 0, w: 5200, h: 1100, snow: 0.34, tint: '#242e3e' }] },
        { id: 'tokyotower', name: '도쿄타워', x: 3300, d: 0.8, scale: 1, glow: '#ff8b5a',
          parts: [
            { k: 'lattice', y0: 0, y1: -120, w0: 100, w1: 46, bands: 3, legs: 4, archy: 0.6, tint: '#c4482c' },
            { k: 'deck', y: -120, w: 52, h: 14, tint: '#d06040' },
            { k: 'lattice', y0: -120, y1: -250, w0: 42, w1: 16, bands: 4, legs: 4, tint: '#c4482c' },
            { k: 'deck', y: -250, w: 22, h: 9, tint: '#d06040' },
            { k: 'mast', y0: -250, y1: -333, w: 5 },
            { k: 'beacon', y: -335, r: 2.8, color: '#ff6a3a', blink: 1.8 },
          ] },
        { id: 'skytree', name: '도쿄 스카이트리', x: -3400, d: 0.85, scale: 1, glow: '#9fb6ff',
          parts: [
            { k: 'lattice', y0: 0, y1: -340, w0: 72, w1: 26, bands: 7, legs: 3, tint: '#4a5468' },
            { k: 'deck', y: -350, w: 44, h: 20, tint: '#5a6478' },
            { k: 'deck', y: -450, w: 30, h: 14, tint: '#5a6478' },
            { k: 'mast', y0: -460, y1: -634, w: 5 },
            { k: 'beacon', y: -636, r: 3, color: '#8fa8ff', blink: 2.2 },
          ] },
        { id: 'rainbow', name: '레인보우 브리지', x: 620, d: 0.13, scale: 1,
          parts: [{ k: 'bridge', y: 0, w: 2400, style: 'suspension', tint: '#242832' }] },
      ],
      /* 제진 구조가 실루엣이 된다 — 곧고 반듯한 슬래브, 안테나 숲.
         좁은 필지에 빽빽하게 서므로 부지 개수가 가장 많다 */
      style: {
        shapes: { slab: 2.4, pylon: 1.8, obelisk: 1.6, taper: 1.3, stack: 1.1, deco: .6,
                  module: 2.2, jenga: 1.8, chamfer: 1.6, bundle: 1.4, twin: 1.3, pagoda: 1.3, cantile: 1.2, drum: 1.0 },
        facades: { grid: 2.2, curtain: 2.0, banded: 1.4, ribbed: 1.0, masonry: .4,
                   mosaic: 1.8, stripe: 1.6, balcony: 1.5, bay: 1.4, chevron: 1.2, louver: 1.0, porthole: .8, vine: 1.0 },
        zones: { office: 1.3, resi: 1.3, retail: 1.4, data: 1.1, lab: 1.1, civic: .9, indus: .8, farm: .7 },
        crowns: ['antenna', 'flat', 'blade', 'tank', 'spike'],
        palette: ['#39414e', '#2f3742', '#454d59', '#343d48', '#3e4652', '#4a4450', '#2e424a'],
        body: '#2d3440', podium: .7, glassK: 1.1,
        hueVar: 20, cohere: .24, green: .40, solar: .40,
      },
      /* 은행나무 가로수와 분재 같은 소나무 — 좁은 틈에도 심는다 */
      flora: { kinds: ['broadleaf', 'conifer', 'planter', 'shrub'], weights: [2.6, 1.8, 2.0, 1.6], h: 11, density: 1.35, tint: '#3e7a4a' },
      lots: CORE(53, 3100, { k: 1.15 }),
      facts: [
        '타워 상단 300m는 능동 질량 감쇠기입니다.',
        '전 층 자판기 수: 118만 대.',
        '지진이 오면 도시가 먼저 알고 기울기를 바꿉니다.',
      ],
    },

    /* ─────────────────────────────────────────────────────────────────
       네옴 — 사막의 직선
       ───────────────────────────────────────────────────────────────── */
    neom: {
      name: '네옴',
      en: 'NEOM · THE LINE',
      emoji: '🏜️',
      tagline: '사막 위에 그어진 500m 높이의 직선, 그 다음 페이지.',
      hint: '거울 장벽 더 라인이 지평선을 자르고, 트로제나의 고리가 하늘에 떠 있다.',
      cityDefault: '네옴 코어',
      lat: 28.0,
      climate: 'desert',
      ground: { type: 'sand', color: [78, 64, 48], water: null },
      sky: { hazeK: 0.82, tintDay: [236, 214, 178], tintNight: [26, 24, 40], pollution: 0.06 },
      aurora: 0, snow: 0, rainOdds: 0.02, dust: 0.5,
      districts: [
        { d: 0.93, h: 26, density: 0.4, tint: [58, 48, 38] },
      ],
      landmarks: [
        { id: 'line', name: '더 라인', x: -2900, d: 0.9, scale: 1, glow: '#c9f0ff',
          parts: [{ k: 'wall', y0: 0, y1: -500, w: 2600, mirror: 1, tint: '#43566b' }] },
        { id: 'line2', name: '더 라인 (동측)', x: 3100, d: 0.93, scale: 1, glow: '#c9f0ff',
          parts: [{ k: 'wall', y0: 0, y1: -500, w: 2200, mirror: 1, tint: '#3d4f63' }] },
        { id: 'trojena', name: '트로제나 링', x: 3600, d: 0.7, scale: 1, glow: '#9fe8ff',
          parts: [{ k: 'ring', y: -720, r: 300, th: 20, tilt: 0.34 }] },
        { id: 'dune', name: '샤르카 능선', x: -1200, d: 0.97, scale: 1,
          parts: [{ k: 'mount', y0: 0, w: 4200, h: 420, snow: 0, tint: '#463a2e' }] },
      ],
      /* 사막의 거울 — 군더더기 없는 단면, 전부 유리.
         물이 귀한 도시라 녹지는 온실 안에서만 자란다 */
      style: {
        shapes: { obelisk: 2.6, needle: 2.2, slab: 1.8, taper: 1.4, spindle: 1.0, deco: .2, stack: .2,
                  shard: 2.4, sail: 2.2, chamfer: 1.8, drum: 1.4, bowtie: 1.2, twin: 1.2, arcology: 1.0, barrel: .9 },
        facades: { curtain: 3.2, banded: 1.4, grid: .8, ribbed: .4, masonry: .1,
                   louver: 2.2, stripe: 1.4, porthole: 1.0, chevron: 1.0, mosaic: .8, lattice: .6, vine: .8 },
        zones: { office: 1.2, lab: 1.6, data: 1.5, farm: 1.2, resi: 1.0, retail: 1.0, civic: .8, indus: .6 },
        crowns: ['blade', 'flat', 'spike', 'garden'],
        palette: ['#3d4a58', '#46586a', '#33424f', '#495a68', '#3a4b5c', '#4e5a5e'],
        body: '#3d4a58', podium: .25, glassK: 1.8,
        hueVar: 15, cohere: .30, green: .34, solar: .85, greenhouse: 1,
      },
      /* 사막 — 대추야자와 왜성 관목, 그리고 관수 화단이 전부다 */
      flora: { kinds: ['palm', 'shrub', 'planter', 'greenhouse'], weights: [1.8, 2.4, 1.4, 1.0], h: 10, density: .55, tint: '#6e8c4e' },
      lots: CORE(71, 4200),
      facts: [
        '모든 외벽이 거울입니다. 도시는 사막을 반사해 스스로를 숨깁니다.',
        '냉각은 홍해 심층수로 합니다.',
        '태양광만으로 연산 전력을 전부 감당합니다.',
      ],
    },

    /* ─────────────────────────────────────────────────────────────────
       몰디브 — 에메랄드 환초 위의 수직 리조트
       ───────────────────────────────────────────────────────────────── */
    maldives: {
      name: '몰디브',
      en: 'MALDIVES · NORTH MALE ATOLL',
      emoji: '🏝️',
      tagline: '산호초 위에 세운 에메랄드빛 수직 리조트.',
      hint: '수상 빌라와 야자수가 발밑에 깔리고, 물이 유리처럼 맑아 도시가 두 번 보입니다.',
      cityDefault: '아톨 시티',
      lat: 4.2,
      climate: 'tropical',
      ground: { type: 'lagoon', color: [216, 206, 176],
                water: { d0: 0.0, d1: 0.72, color: [24, 132, 138], reflect: 0.78 } },
      sky: { hazeK: 0.86, tintDay: [206, 226, 240], tintNight: [20, 34, 56], pollution: 0.02 },
      aurora: 0, snow: 0, rainOdds: 0.22,
      districts: [
        { d: 0.94, h: 16, density: 0.28, tint: [96, 110, 108] },
      ],
      /* 휴양 도시 — 가볍고 밝은 외피, 층마다 테라스.
         파도와 야자에 둘러싸인 도시라 곡면과 녹지가 함께 많다 */
      style: {
        shapes: { taper: 2.0, twist: 2.0, helix: 1.8, spindle: 1.6, needle: 1.2, slab: .8, deco: .3, ziggurat: .3,
                  terrace: 2.6, sail: 2.2, barrel: 1.8, drum: 1.6, bowtie: 1.4, shard: 1.2, arcology: 1.0, mesa: .9 },
        facades: { banded: 2.4, curtain: 2.0, grid: 1.2, panel: .8, ribbed: .6, masonry: .2, diagrid: 1.0, checker: .6,
                   balcony: 2.8, vine: 2.2, bay: 1.6, mosaic: 1.4, lattice: 1.0, stripe: .8, porthole: .8 },
        zones: { resi: 1.6, retail: 1.4, farm: 1.5, civic: .9, office: .8, lab: .8, data: .5, indus: .3 },
        crowns: ['garden', 'blade', 'flat', 'tank'],
        palette: ['#6a7472', '#7b8178', '#5e6a6a', '#807568', '#6f7e7c', '#74806e'],
        body: '#5d6f72', podium: .45, glassK: 1.5,
        hueVar: 17, cohere: .26, green: .60, solar: .55,
      },
      /* 야자와 판다누스 — 물가를 따라 빽빽하다 */
      flora: { kinds: ['palm', 'broadleaf', 'shrub', 'planter'], weights: [3.4, 1.4, 1.8, 1.0], h: 15, density: 1.5, tint: '#4f9457' },
      landmarks: [
        { id: 'villaW', name: '서측 수상 빌라', x: -3050, d: 0.34, scale: 1, glow: '#ffd39a',
          parts: [{ k: 'overwater', y: 0, w: 900, h: 34, n: 7, tint: '#9a7a52' }] },
        { id: 'villaE', name: '동측 수상 빌라', x: 3150, d: 0.30, scale: 1, glow: '#ffd39a',
          parts: [{ k: 'overwater', y: 0, w: 780, h: 30, n: 6, tint: '#8f7048' }] },
        { id: 'islet', name: '야자 모래섬', x: -1750, d: 0.80, scale: 1, glow: '#ffe4b0',
          parts: [
            { k: 'mount', y0: 0, w: 900, h: 26, snow: 0, tint: '#cfc09a' },
            { k: 'palm', y: -14, h: 62, bend: -.4, off: -220 },
            { k: 'palm', y: -16, h: 74, bend: .25, off: -60 },
            { k: 'palm', y: -14, h: 56, bend: .5, off: 110 },
            { k: 'palm', y: -12, h: 66, bend: -.2, off: 280 },
            { k: 'hut', y: -14, w: 70, h: 22, tint: '#a8865c', off: 30 },
          ] },
        { id: 'islet2', name: '동쪽 모래톱', x: 2200, d: 0.86, scale: 1, glow: '#ffe4b0',
          parts: [
            { k: 'mount', y0: 0, w: 700, h: 20, snow: 0, tint: '#c8b994' },
            { k: 'palm', y: -11, h: 54, bend: .35, off: -140 },
            { k: 'palm', y: -12, h: 64, bend: -.3, off: 80 },
            { k: 'palm', y: -10, h: 48, bend: .15, off: 250 },
          ] },
        { id: 'jetty', name: '수상 비행장', x: 1300, d: 0.16, scale: 1, glow: '#ffe2a8',
          parts: [
            { k: 'overwater', y: 0, w: 520, h: 26, n: 3, tint: '#8a7050' },
            { k: 'ship', y: 0, w: 130, h: 30, off: -420 },
          ] },
        { id: 'reefline', name: '환초 바깥 능선', x: 0, d: 0.93, scale: 1,
          parts: [{ k: 'mount', y0: 0, w: 7000, h: 44, snow: 0, tint: '#5d7f86' }] },
      ],
      lots: CORE(404, 1600),
      facts: [
        '해수 온도차로 전력을 만듭니다. 연료를 한 방울도 쓰지 않습니다.',
        '기초는 산호를 피해 띄워 놓았습니다.',
        '모든 층에 발코니가 있습니다. 규정입니다.',
        '수위가 1m 올라도 도시는 그대로 뜹니다.',
      ],
    },

    /* ─────────────────────────────────────────────────────────────────
       크리스마스 마을 — 눈에 파묻힌 통나무집과 모닥불
       ───────────────────────────────────────────────────────────────── */
    christmas: {
      name: '크리스마스 마을',
      en: 'CHRISTMAS VILLAGE · NORTH POLE',
      emoji: '🎄',
      tagline: '굴뚝마다 연기가 오르는, 눈에 파묻힌 마을.',
      hint: '마천루가 없습니다. 통나무집과 모닥불, 전나무 숲, 그리고 밤마다 지나가는 썰매.',
      cityDefault: '노엘 빌리지',
      suggestMood: 'xmas',
      /* 마을 모드 — 타워 대신 오두막이 선다 */
      village: 1,
      popGoal: 9500,
      lat: 66.5,
      climate: 'arctic',
      xmas: 1,
      ground: { type: 'ice', color: [186, 198, 220], water: null },
      sky: { hazeK: 0.92, tintDay: [214, 224, 246], tintNight: [30, 26, 60], pollution: 0 },
      aurora: 0.95, snow: 1.5, rainOdds: 0,
      districts: [
        { d: 0.94, h: 14, density: 0.30, tint: [92, 78, 96] },
      ],
      style: {
        crowns: ['star', 'wreath', 'flat'],
        palette: ['#6b4a36', '#5a4432', '#7a5a40', '#4e4038', '#6a3f36', '#59463a'],
        body: '#5f4634', podium: .1, glassK: .5,
        hueVar: 22, cohere: .20, green: .2, solar: .04,
      },
      /* 마을을 둘러싼 전나무 숲 — 랜드마크 숲 바깥까지 이어진다 */
      flora: { kinds: ['conifer', 'shrub'], weights: [4.0, 1.0], h: 13, density: 1.8, tint: '#2f6046' },
      landmarks: [
        /* 마을 광장의 큰 트리 — 마을에서 가장 높다 */
        { id: 'bigtree', name: '광장의 트리', x: 70, d: 0.48, scale: 1, glow: '#8fffb0',
          parts: [
            { k: 'box', y0: 0, y1: -1.6, w: 9, tint: '#4a3a30' },
            { k: 'tree', y0: -1.6, h: 34, w: 21, tiers: 6, star: 1 },
            { k: 'gift', y: 0, w: 22, n: 10, seed: 24, off: -15 },
            { k: 'snowman', y: 0, h: 4.4, off: 17 },
          ] },
        { id: 'chapel', name: '눈의 예배당', x: -230, d: 0.58, scale: 1, glow: '#ffd79a',
          parts: [
            { k: 'box', y0: 0, y1: -9, w: 17, tint: '#6a5442', win: 'sparse' },
            { k: 'spire', y0: -9, y1: -23, w0: 8, w1: 1.2, tint: '#7a4a3e' },
            { k: 'beacon', y: -24, r: .7, color: '#ffe08a', blink: 3.2 },
            { k: 'tree', y0: 0, h: 12, w: 8, tiers: 3, star: 0, off: 17 },
          ] },
        { id: 'workshop', name: '산타의 공방', x: 340, d: 0.55, scale: 1, glow: '#ffb45a',
          parts: [
            { k: 'hut', y: 0, w: 30, h: 10, tint: '#8e3b34' },
            { k: 'hut', y: 0, w: 17, h: 7, tint: '#7a332d', off: -26 },
            { k: 'hut', y: 0, w: 14, h: 6, tint: '#6f3b46', off: 25 },
            { k: 'mast', y0: -13, y1: -22, w: .8 },
            { k: 'beacon', y: -22.5, r: .8, color: '#ff5a5a', blink: 1.4 },
            { k: 'tree', y0: 0, h: 14, w: 9, tiers: 4, star: 1, off: 40 },
            { k: 'snowman', y: 0, h: 5, off: 15 },
            { k: 'gift', y: 0, w: 19, n: 11, seed: 12, off: -15 },
          ] },
        { id: 'grove', name: '전나무 숲', x: -520, d: 0.78, scale: 1, glow: '#7ce8a0',
          parts: [
            { k: 'tree', y0: 0, h: 15, w: 10, tiers: 4, star: 0, off: -190 },
            { k: 'tree', y0: 0, h: 20, w: 13, tiers: 5, star: 0, off: -115 },
            { k: 'tree', y0: 0, h: 12, w: 8, tiers: 3, star: 0, off: -35 },
            { k: 'tree', y0: 0, h: 18, w: 11, tiers: 4, star: 0, off: 55 },
            { k: 'tree', y0: 0, h: 13, w: 9, tiers: 3, star: 0, off: 145 },
            { k: 'tree', y0: 0, h: 16, w: 10, tiers: 4, star: 0, off: 235 },
          ] },
        { id: 'grove2', name: '북쪽 전나무', x: 700, d: 0.74, scale: 1, glow: '#7ce8a0',
          parts: [
            { k: 'tree', y0: 0, h: 15, w: 10, tiers: 4, star: 0, off: -90 },
            { k: 'tree', y0: 0, h: 12, w: 8, tiers: 3, star: 0, off: 0 },
            { k: 'tree', y0: 0, h: 18, w: 11, tiers: 5, star: 0, off: 105 },
            { k: 'tree', y0: 0, h: 11, w: 8, tiers: 3, star: 0, off: 200 },
          ] },
        { id: 'lane', name: '캔디케인 거리', x: 90, d: 0.16, scale: 1, glow: '#ffd2d2',
          parts: [
            { k: 'candycane', y: 0, h: 6.5, off: -270 },
            { k: 'candycane', y: 0, h: 6.5, off: -100 },
            { k: 'candycane', y: 0, h: 6.5, off: 100 },
            { k: 'candycane', y: 0, h: 6.5, off: 270 },
            { k: 'snowman', y: 0, h: 4.6, off: 14 },
          ] },
        { id: 'ridge', name: '북극 능선', x: -200, d: 0.96, scale: 1,
          parts: [{ k: 'mount', y0: 0, w: 1800, h: 95, snow: 0.95, tint: '#4a5a76' }] },
      ],
      /* 통나무집이 골목을 이루며 퍼진다 — 넓고 낮게 */
      lots: lots(
        { d: 0.74, n: 10, x0: -560, x1: 560, w: 26, max: 13, seed: 1220, jit: .7 },
        { d: 0.64, n: 9, x0: -520, x1: 520, w: 29, max: 17, seed: 1221, jit: .7 },
        { d: 0.54, n: 8, x0: -480, x1: 480, w: 32, max: 22, seed: 1222, jit: .7 },
        { d: 0.44, n: 7, x0: -440, x1: 440, w: 35, max: 20, seed: 1223, jit: .7 },
        { d: 0.34, n: 6, x0: -400, x1: 400, w: 39, max: 16, seed: 1224, jit: .7 },
        { d: 0.24, n: 5, x0: -350, x1: 350, w: 43, max: 13, seed: 1225, jit: .7 },
        { d: 0.13, n: 4, x0: -300, x1: 300, w: 47, max: 11, seed: 1226, jit: .7 }
      ),
      facts: [
        '공방은 3교대로 돕니다. 쉬는 날은 12월 26일 하루뿐입니다.',
        '광장 트리의 전구는 41,200개. 전부 굴뚝 폐열로 켭니다.',
        '썰매 항로는 매일 자정에 갱신됩니다.',
        '굴뚝은 장식이 아니라 실제 배송 통로입니다.',
        '루돌프의 코는 착륙 유도등으로 등록되어 있습니다.',
        '모닥불은 마을 조례상 절대 꺼뜨릴 수 없습니다.',
      ],
    },

    /* ─────────────────────────────────────────────────────────────────
       숲 공원 — 나무가 도시를 이긴 곳
       ───────────────────────────────────────────────────────────────── */
    forest: {
      name: '숲 공원',
      en: 'GREENWOOD PARK',
      emoji: '🌳',
      tagline: '나무가 도시를 이긴 곳. 통나무 산장과 호수, 그리고 반딧불.',
      hint: '마천루가 없습니다. 울창한 숲과 호수, 등불이 놓인 산책길, 밤이면 떠오르는 반딧불.',
      cityDefault: '그린우드',
      suggestMood: 'bio',
      /* 마을 모드 — 타워 대신 산장이 선다 */
      village: 1,
      popGoal: 13000,
      lat: 45.2,
      climate: 'temperate',
      /* 이 부지의 주인공 — 밤의 반딧불과 조용한 교통량 */
      fireflies: 1.1,
      traffic: { sim: .42, car: .08, air: .14 },
      ground: {
        type: 'lake',
        color: [47, 59, 49],
        water: { d0: 0.0, d1: 0.46, color: [18, 44, 46], reflect: 0.70 },
      },
      /* 숲의 공기는 늘 젖어 있다 — 안개를 가장 두껍게 깐다 */
      sky: { hazeK: 1.12, tintDay: [198, 214, 200], tintNight: [18, 31, 38], pollution: 0 },
      aurora: 0, snow: 0, rainOdds: 0.34,
      landmarks: [
        /* 공원의 주인 — 삼백 년 된 거목. 가지에 등불이 걸려 있다 */
        { id: 'oldtree', name: '삼백 년 참나무', x: 40, d: 0.50, scale: 1, glow: '#ffd08a',
          parts: [
            { k: 'broad', y: 0, h: 44, w: 46, tint: '#2f6040', bark: '#4a3a2c', lantern: 1 },
            { k: 'lamp', y: 0, h: 7, off: -38 },
            { k: 'lamp', y: 0, h: 7, off: 40 },
          ] },
        /* 호수 산장 — 굴뚝에서 연기가 오른다 */
        { id: 'lodge', name: '호수 산장', x: -320, d: 0.56, scale: 1, glow: '#ffb45a',
          parts: [
            { k: 'hut', y: 0, w: 46, h: 15, tint: '#6a4a34' },
            { k: 'hut', y: 0, w: 22, h: 9, tint: '#5c4030', off: -38 },
            { k: 'mast', y0: -20, y1: -30, w: 1.2, tint: '#4a3a30' },
            { k: 'beacon', y: -31, r: .9, color: '#ffb45a', blink: 2.6 },
            { k: 'broad', y: 0, h: 26, w: 26, tint: '#2b5a3c', off: 44 },
            { k: 'tree', y0: 0, h: 19, w: 12, tiers: 5, star: 0, lights: 0, snow: 0, off: -66 },
          ] },
        /* 보트 창고 — 물 위에 낸 잔교 */
        { id: 'boathouse', name: '보트 창고', x: 430, d: 0.30, scale: 1, glow: '#ffd39a',
          parts: [
            { k: 'overwater', y: 0, w: 150, h: 16, n: 2, tint: '#7a5a3c' },
          ] },
        /* 전나무 숲 — 세 무리로 나눠 깊이를 만든다 */
        { id: 'grove1', name: '서쪽 전나무 숲', x: -620, d: 0.72, scale: 1, glow: '#8fe0a8',
          parts: [
            { k: 'tree', y0: 0, h: 26, w: 16, tiers: 6, star: 0, lights: 0, snow: 0, off: -210 },
            { k: 'tree', y0: 0, h: 33, w: 20, tiers: 7, star: 0, lights: 0, snow: 0, off: -120 },
            { k: 'tree', y0: 0, h: 22, w: 14, tiers: 5, star: 0, lights: 0, snow: 0, off: -40 },
            { k: 'broad', y: 0, h: 30, w: 32, tint: '#2c5c3c', off: 50 },
            { k: 'tree', y0: 0, h: 29, w: 18, tiers: 6, star: 0, lights: 0, snow: 0, off: 140 },
            { k: 'tree', y0: 0, h: 24, w: 15, tiers: 5, star: 0, lights: 0, snow: 0, off: 225 },
          ] },
        { id: 'grove2', name: '동쪽 참나무 숲', x: 700, d: 0.66, scale: 1, glow: '#8fe0a8',
          parts: [
            { k: 'broad', y: 0, h: 34, w: 36, tint: '#306442', off: -140 },
            { k: 'tree', y0: 0, h: 27, w: 17, tiers: 6, star: 0, lights: 0, snow: 0, off: -30 },
            { k: 'broad', y: 0, h: 28, w: 30, tint: '#2a5a3a', off: 70 },
            { k: 'tree', y0: 0, h: 21, w: 13, tiers: 5, star: 0, lights: 0, snow: 0, off: 180 },
          ] },
        { id: 'grove3', name: '숲의 안쪽', x: -120, d: 0.86, scale: 1, glow: '#7ed49c',
          parts: [
            { k: 'tree', y0: 0, h: 36, w: 21, tiers: 7, star: 0, lights: 0, snow: 0, off: -320 },
            { k: 'tree', y0: 0, h: 30, w: 18, tiers: 6, star: 0, lights: 0, snow: 0, off: -180 },
            { k: 'broad', y: 0, h: 32, w: 34, tint: '#27563a', off: -50 },
            { k: 'tree', y0: 0, h: 34, w: 20, tiers: 7, star: 0, lights: 0, snow: 0, off: 90 },
            { k: 'tree', y0: 0, h: 27, w: 17, tiers: 6, star: 0, lights: 0, snow: 0, off: 240 },
            { k: 'broad', y: 0, h: 29, w: 31, tint: '#2b5c3e', off: 380 },
          ] },
        /* 산책길 — 등불이 길을 만든다. 가장 앞줄이라 제일 크게 보인다 */
        { id: 'path', name: '등불 산책길', x: 60, d: 0.14, scale: 1, glow: '#ffd2a0',
          parts: [
            { k: 'lamp', y: 0, h: 9, off: -330 },
            { k: 'lamp', y: 0, h: 9, off: -160 },
            { k: 'lamp', y: 0, h: 9, off: 10 },
            { k: 'lamp', y: 0, h: 9, off: 180 },
            { k: 'lamp', y: 0, h: 9, off: 350 },
          ] },
        /* 나무 다리 — 호수의 좁은 목을 건넌다 */
        { id: 'woodbr', name: '나무 다리', x: -180, d: 0.20, scale: 1, glow: '#ffcf96',
          parts: [{ k: 'bridge', y: 0, w: 620, style: 'arch', tint: '#4a3c2e' }] },
        /* 뒷산 — 눈 없는 침엽수 능선 */
        { id: 'ridge', name: '뒷산 능선', x: -80, d: 0.97, scale: 1,
          parts: [{ k: 'mount', y0: 0, w: 2600, h: 150, snow: 0, tint: '#26402f' }] },
      ],
      /* 산장은 통나무와 이끼 — 크리스마스 마을보다 초록에 가깝다 */
      style: {
        crowns: ['garden', 'flat', 'tank'],
        palette: ['#5e4636', '#6b5038', '#4c4234', '#63513c', '#55483a', '#6a4a3a'],
        body: '#574434', podium: .08, glassK: .6,
        hueVar: 20, cohere: .22, green: .9, solar: .06,
      },
      /* 울창함은 여기서 나온다 — 밀도를 다른 부지의 세 배로 준다 */
      flora: {
        kinds: ['conifer', 'broadleaf', 'shrub', 'planter'],
        weights: [3.4, 2.8, 2.2, .7], h: 22, density: 5.2, tint: '#2f6a42',
      },
      /* 산장은 숲에 파묻혀 드문드문 — 부지 사이를 나무가 채운다 */
      lots: lots(
        { d: 0.78, n: 7, x0: -600, x1: 600, w: 27, max: 15, seed: 5510, jit: .8, hVar: .7 },
        { d: 0.68, n: 6, x0: -560, x1: 560, w: 30, max: 19, seed: 5511, jit: .8, hVar: .7 },
        { d: 0.58, n: 6, x0: -520, x1: 520, w: 33, max: 23, seed: 5512, jit: .8, hVar: .75 },
        { d: 0.46, n: 5, x0: -470, x1: 470, w: 36, max: 21, seed: 5513, jit: .85, hVar: .75 },
        { d: 0.36, n: 5, x0: -420, x1: 420, w: 40, max: 17, seed: 5514, jit: .85, hVar: .8 },
        { d: 0.26, n: 4, x0: -370, x1: 370, w: 44, max: 14, seed: 5515, jit: .9, hVar: .8 },
        { d: 0.16, n: 3, x0: -300, x1: 300, w: 48, max: 12, seed: 5516, jit: .9, hVar: .8 }
      ),
      facts: [
        '나무를 베고 지은 것이 아니라, 나무 사이에 끼워 지었습니다.',
        '반딧불은 도시 조명 조례의 보호 대상입니다. 밤에 가로등을 낮춥니다.',
        '산장 굴뚝의 연기는 전부 폐목 난로에서 나옵니다.',
        '호수는 도시의 저수지이면서 수영장입니다.',
        '삼백 년 참나무의 뿌리 반경 안에서는 굴착이 금지됩니다.',
        '가장 시끄러운 소리는 밤 열한 시의 개구리입니다.',
      ],
    },

    /* ─────────────────────────────────────────────────────────────────
       남극 — 얼음 위의 연산 도시
       ───────────────────────────────────────────────────────────────── */
    antarctica: {
      name: '남극',
      en: 'ANTARCTICA · VOSTOK PLATEAU',
      emoji: '🐧',
      tagline: '세상에서 가장 큰 냉각기 위에 지은 연산 도시.',
      hint: '−60℃의 공기가 공짜 냉각수다. 빙붕과 오로라, 그리고 옛 기지의 불빛.',
      cityDefault: '보스토크 시티',
      lat: -78,
      climate: 'arctic',
      ground: { type: 'ice', color: [188, 206, 222], water: { d0: 0.0, d1: 0.66, color: [28, 48, 68], reflect: 0.46 } },
      sky: { hazeK: 0.9, tintDay: [214, 228, 244], tintNight: [16, 24, 44], pollution: 0.0 },
      aurora: 1.0, snow: 0.85, rainOdds: 0,
      districts: [
        { d: 0.95, h: 18, density: 0.22, tint: [116, 134, 154] },
      ],
      landmarks: [
        { id: 'berg1', name: '빙산 A-76', x: -2500, d: 0.92, scale: 1,
          parts: [{ k: 'berg', y0: 0, w: 1900, h: 260, seed: 7, tint: '#8ea8c0' }] },
        { id: 'berg2', name: '빙붕 단애', x: 2700, d: 0.88, scale: 1,
          parts: [{ k: 'berg', y0: 0, w: 2400, h: 180, seed: 21, tint: '#7e98b2' }] },
        { id: 'base', name: '보스토크 기지', x: 3000, d: 0.6, scale: 1, glow: '#ffb86a',
          parts: [
            { k: 'hut', y: 0, w: 130, h: 34, tint: '#8a3a2c' },
            { k: 'hut', y: 0, w: 70, h: 24, tint: '#7a3226', off: -120 },
            { k: 'mast', y0: -34, y1: -96, w: 3 },
            { k: 'dish', y: -60, r: 22, off: 120 },
            { k: 'beacon', y: -98, r: 2.4, color: '#ff9a4a', blink: 2.8 },
          ] },
        { id: 'ridge', name: '횡단산맥', x: -600, d: 0.98, scale: 1,
          parts: [{ k: 'mount', y0: 0, w: 6000, h: 620, snow: 0.9, tint: '#39516b' }] },
      ],
      /* 극지 단열 구조 — 두꺼운 슬래브에 좁은 리본창, 그리고 루버.
         창을 크게 낼 수 없는 기후라 벽이 넓고 유리가 귀하다.
         색은 얼음 반사광에 묻히지 않도록 채도를 좁게 묶는다. */
      style: {
        shapes: { slab: 2.6, pylon: 1.8, ziggurat: 1.4, taper: 1.2, obelisk: 1.0, needle: .4,
                  mesa: 2.4, buttress: 2.2, module: 2.0, bundle: 1.4, chamfer: 1.3, drum: 1.2, terrace: .8 },
        facades: { banded: 2.8, grid: 1.6, curtain: 1.0, ribbed: .8, masonry: .5,
                   louver: 3.0, porthole: 2.0, panel: 2.0, lattice: 1.2, stripe: 1.0, mosaic: .6, balcony: .3, vine: .4 },
        /* 얼음 위에 지은 이유가 냉각이다 — 도시의 절반이 연산동이다 */
        zones: { data: 3.2, lab: 2.2, farm: 1.6, indus: 1.2, civic: .8, resi: .7, office: .6, retail: .35 },
        crowns: ['tank', 'flat', 'antenna', 'blade'],
        palette: ['#39434f', '#44505e', '#323c48', '#3f4b58', '#3c4a52'],
        body: '#39434f', podium: .9, glassK: .9,
        hueVar: 10, cohere: .34, green: .18, solar: .12, greenhouse: 1,
      },
      /* 실외에서 자라는 건 이끼와 왜성 관목뿐. 나무는 온실 안에 있다 */
      flora: { kinds: ['greenhouse', 'shrub'], weights: [2.0, 3.0], h: 7, density: .62, tint: '#3d6b52' },
      /* ── 배치: 바람과 냉각이 결정한다 ──────────────────────────────
         ① 활주로처럼 뻗은 저층 연산동 열 — 바람을 흘리려고 길고 낮다
         ② 중앙 코어 군집 — 냉각수 배관이 짧아야 하므로 모여 선다
         ③ 앞줄은 온실·기지 시설 — 사람이 드나드는 것만 앞에 둔다 */
      lots: lots(
        /* ① 고원 뒤쪽, 바람을 등진 연산동 슬래브 열 */
        { d: 0.72, n: 11, x0: -3100, x1: 3100, w: 330, max: 820, seed: 91, zone: 'data', jit: .25, hVar: .5 },
        { d: 0.64, n: 9, x0: -2700, x1: 2700, w: 300, max: 1150, seed: 92, zone: 'data', jit: .3, hVar: .6 },
        /* ② 중앙 코어 — 가장 높은 것들이 한 덩어리로 모인다 */
        cluster({ d: 0.52, n: 7, xc: -250, span: 1500, w: 340, max: 2400, seed: 93, zone: 'data', falloff: .5 }),
        cluster({ d: 0.42, n: 5, xc: 150, span: 1100, w: 380, max: 2200, seed: 94, zone: 'lab', falloff: .45 }),
        /* 기지 군집 — 옛 보스토크 기지 쪽에 낮게 붙어 있다 */
        cluster({ d: 0.34, n: 6, xc: 1900, span: 1000, w: 300, max: 560, seed: 95, zone: 'lab', falloff: .7 }),
        cluster({ d: 0.30, n: 5, xc: -1850, span: 900, w: 320, max: 480, seed: 96, zone: 'indus', falloff: .7 }),
        /* ③ 앞줄 — 온실 농장과 주거. 낮고 넓게 퍼진다 */
        { d: 0.20, n: 7, x0: -1600, x1: 1600, w: 400, max: 300, seed: 97, zone: 'farm', jit: .5, hVar: .7 },
        { d: 0.11, n: 8, x0: -1400, x1: 1400, w: 330, max: 190, seed: 98, zone: 'resi', jit: .6, hVar: .8 }
      ),
      facts: [
        '외기 −60℃. 냉각 비용이 0에 수렴합니다.',
        '얼음 아래 4km 호수에서 물을 끌어옵니다.',
        '오로라가 강한 밤엔 전력망을 스스로 낮춥니다.',
        '연산동은 창을 내지 않습니다. 열이 새기 때문입니다.',
        '도시의 모든 채소는 앞줄 온실 여덟 동에서 나옵니다.',
      ],
    },

    /* ─────────────────────────────────────────────────────────────────
       북극 — 부빙 위에 떠 있는 도시
       ───────────────────────────────────────────────────────────────── */
    arctic: {
      name: '북극',
      en: 'ARCTIC · 90°N DRIFT',
      emoji: '❄️',
      tagline: '부빙 위를 천천히 표류하는 극지 마천루.',
      hint: '오로라가 가장 강한 맵. 쇄빙선과 등대가 어둠 속에서 유일한 이웃이다.',
      cityDefault: '노스폴 시티',
      lat: 89,
      climate: 'arctic',
      ground: { type: 'ice', color: [176, 198, 220], water: { d0: 0.0, d1: 0.74, color: [16, 34, 58], reflect: 0.60 } },
      sky: { hazeK: 0.86, tintDay: [206, 224, 244], tintNight: [12, 20, 40], pollution: 0.0 },
      aurora: 1.35, snow: 1.0, rainOdds: 0,
      districts: [
        { d: 0.95, h: 14, density: 0.16, tint: [108, 128, 150] },
      ],
      landmarks: [
        { id: 'floe1', name: '부빙 단애', x: -2800, d: 0.9, scale: 1,
          parts: [{ k: 'berg', y0: 0, w: 2200, h: 200, seed: 3, tint: '#7d9ab6' }] },
        { id: 'floe2', name: '압력 능선', x: 2400, d: 0.86, scale: 1,
          parts: [{ k: 'berg', y0: 0, w: 1700, h: 300, seed: 45, tint: '#89a4bf' }] },
        { id: 'breaker', name: '쇄빙선 아르크티카', x: -3100, d: 0.36, scale: 1, glow: '#ffcf8a',
          parts: [{ k: 'ship', y: 0, w: 300, h: 70 }] },
        { id: 'light', name: '표류 등대', x: 3200, d: 0.46, scale: 1, glow: '#ffe2a0',
          parts: [
            { k: 'taper', y0: 0, y1: -72, w0: 26, w1: 16, tint: '#d8dde4' },
            { k: 'deck', y: -72, w: 24, h: 10, tint: '#8a3a2c' },
            { k: 'beacon', y: -82, r: 4.2, color: '#ffd27a', blink: 1.1 },
          ] },
      ],
      /* 부빙 위 — 무게중심을 낮게 잡은 넓은 기단.
         떠 있는 도시라 높이보다 균형이 먼저다. 계단식으로 무게를 내린다. */
      style: {
        shapes: { slab: 2.4, ziggurat: 2.0, stack: 1.6, pylon: 1.4, taper: 1.0, needle: .3,
                  buttress: 2.6, mesa: 2.2, module: 1.8, terrace: 1.4, drum: 1.3, chamfer: 1.2, bundle: 1.0 },
        facades: { banded: 2.6, grid: 1.8, ribbed: 1.0, curtain: .9, masonry: .4,
                   louver: 2.6, porthole: 2.4, panel: 1.8, lattice: 1.2, stripe: .9, mosaic: .7, vine: .5, balcony: .4 },
        /* 쇄빙선이 드나드는 항만 도시 — 연산동에 항만 산업이 붙는다 */
        zones: { data: 2.6, indus: 2.0, lab: 1.8, farm: 1.5, resi: .9, civic: .8, office: .6, retail: .4 },
        crowns: ['tank', 'flat', 'antenna', 'pyramid'],
        palette: ['#36414e', '#414d5c', '#2f3a46', '#3c4856', '#394650'],
        body: '#36414e', podium: .95, glassK: .9,
        hueVar: 9, cohere: .36, green: .16, solar: .08, greenhouse: 1,
      },
      flora: { kinds: ['greenhouse', 'shrub'], weights: [2.4, 2.6], h: 6, density: .55, tint: '#396850' },
      /* ── 배치: 부력이 결정한다 ────────────────────────────────────────
         케이슨 하나에 여러 채를 나눠 얹으므로 건물이 섬처럼 군집을 이루고,
         군집과 군집 사이는 비워 둔다 — 얼음이 갈라질 자리다.
         가장 높은 것은 도시 중앙 한 곳에만 세운다. */
      lots: lots(
        /* 뒤쪽 부빙 — 낮고 넓은 연산 케이슨 군집 셋 */
        cluster({ d: 0.68, n: 6, xc: -2100, span: 900, w: 320, max: 700, seed: 61, zone: 'data', falloff: .6 }),
        cluster({ d: 0.66, n: 6, xc: 0, span: 950, w: 330, max: 900, seed: 62, zone: 'data', falloff: .6 }),
        cluster({ d: 0.64, n: 5, xc: 2200, span: 850, w: 310, max: 760, seed: 63, zone: 'indus', falloff: .65 }),
        /* 중앙 케이슨 — 도시에서 유일하게 높이 올라가는 자리 */
        cluster({ d: 0.48, n: 6, xc: -150, span: 1150, w: 370, max: 2100, seed: 64, zone: 'data', falloff: .52 }),
        cluster({ d: 0.38, n: 4, xc: 250, span: 800, w: 400, max: 1600, seed: 65, zone: 'lab', falloff: .5 }),
        /* 항만 — 쇄빙선이 붙는 쪽에 낮은 산업동 */
        cluster({ d: 0.30, n: 5, xc: -1900, span: 800, w: 350, max: 420, seed: 66, zone: 'indus', falloff: .7 }),
        cluster({ d: 0.26, n: 4, xc: 1800, span: 700, w: 330, max: 380, seed: 67, zone: 'lab', falloff: .7 }),
        /* 앞줄 — 온실 농장과 저층 주거 */
        { d: 0.17, n: 6, x0: -1300, x1: 1300, w: 390, max: 260, seed: 68, zone: 'farm', jit: .55, hVar: .7 },
        { d: 0.08, n: 7, x0: -1100, x1: 1100, w: 320, max: 165, seed: 69, zone: 'resi', jit: .6, hVar: .8 }
      ),
      facts: [
        '도시는 하루에 3km씩 표류합니다.',
        '겨울에는 해가 뜨지 않습니다. 오로라가 조명입니다.',
        '기초는 얼음이 아니라 부력 케이슨입니다.',
        '케이슨 하나에 여섯 채까지 얹습니다. 그 이상은 기울어집니다.',
        '군집 사이 빈 자리는 얼음이 갈라질 자리입니다. 비워 둡니다.',
      ],
    },
  };

  /* ── 무드(컨셉) ───────────────────────────────────────────────────────
     타워의 창문 색·크라운 형태·네온·공기색을 바꾼다. 맵과 직교한다. */
  const MOODS = {
    neon: {
      name: '네온 오버드라이브', en: 'NEON',
      hint: '시안과 마젠타. 창문마다 다른 색이 켜지고 옥상 사인이 흐른다.',
      accent: '#5fd8ff',
      win: [[255, 214, 130], [120, 230, 255], [255, 120, 190], [170, 255, 210]],
      winMix: [0.72, 0.14, 0.09, 0.05],
      neon: 1.0, signs: 1.0, crown: 'blade', skyTint: [30, 46, 82], grow: 1.0,
    },
    mono: {
      name: '화이트 모놀리스', en: 'MONOLITH',
      hint: '순백 콘크리트와 차가운 흰빛. 소음이 없는 도시.',
      accent: '#cfe3f2',
      win: [[240, 246, 255], [206, 224, 244], [255, 250, 232]],
      winMix: [0.6, 0.3, 0.1],
      neon: 0.18, signs: 0.15, crown: 'flat', skyTint: [34, 42, 62], grow: 0.92,
    },
    bio: {
      name: '바이오 테라스', en: 'BIOPHILIC',
      hint: '층마다 숲이 매달린다. 초록 조명과 안개 낀 공중정원.',
      accent: '#6fe0a8',
      win: [[255, 226, 158], [150, 245, 190], [210, 255, 220]],
      winMix: [0.5, 0.34, 0.16],
      neon: 0.35, signs: 0.3, crown: 'garden', greenery: 1.0, skyTint: [28, 50, 54], grow: 0.86,
    },
    gold: {
      name: '골드 에이지', en: 'GOLDEN AGE',
      hint: '황금빛 아르데코 크라운. 따뜻하고 오래된 미래.',
      accent: '#ffc46a',
      win: [[255, 206, 128], [255, 170, 92], [255, 236, 186]],
      winMix: [0.55, 0.28, 0.17],
      neon: 0.45, signs: 0.55, crown: 'deco', skyTint: [56, 40, 44], grow: 0.95,
    },
    xmas: {
      name: '크리스마스', en: 'CHRISTMAS',
      hint: '창문마다 빨강과 초록이 켜지고 옥상마다 별이 뜹니다.',
      accent: '#ff6b6b',
      win: [[255, 216, 150], [255, 92, 92], [110, 240, 150], [255, 246, 236]],
      winMix: [0.44, 0.25, 0.21, 0.10],
      neon: .95, signs: .75, crown: 'star', skyTint: [44, 30, 62], grow: .95,
    },
    quantum: {
      name: '퀀텀 바이올렛', en: 'QUANTUM',
      hint: '연산 코어의 보라색 맥동이 외벽을 타고 오른다.',
      accent: '#b48cff',
      win: [[200, 170, 255], [255, 210, 240], [140, 210, 255]],
      winMix: [0.54, 0.26, 0.2],
      neon: 0.85, signs: 0.6, crown: 'spike', pulse: 1.0, skyTint: [44, 34, 78], grow: 1.08,
    },
  };

  /* ── 시간대 프리셋 ────────────────────────────────────────────────────
     auto 는 하루가 계속 흐른다. 나머지는 그 시각에 하늘을 고정한다.
       glow   도시광(스카이글로우) 배율
       win    창문 점등 밝기 배율
       star   별 밝기 배율
       vig    비네트 배율 — 클수록 화면 가장자리가 잠긴다
       sky    하늘 자체의 밝기 배율
       haze   대기 안개 배율 — 크면 빛이 번지고, 작으면 멀리까지 또렷하다 */
  const TIMES = {
    auto:  { name: '자동 순환', en: 'CYCLE',
             hint: '해가 뜨고 집니다. 하루가 2분 48초로 흐릅니다.', hour: null },
    dawn:  { name: '아침', en: 'DAWN',
             hint: '해가 막 올라온 시각. 창문의 불이 하나씩 꺼집니다.',
             hour: 6.4, glow: .7, win: .85, star: .45, vig: .9, sky: 1.0, haze: 1.15 },
    noon:  { name: '점심', en: 'NOON',
             hint: '한낮. 유리에 하늘이 통째로 비칩니다.',
             hour: 12.7, glow: .3, win: .7, star: 0, vig: .78, sky: 1.0, haze: 1.0 },
    dusk:  { name: '저녁', en: 'DUSK',
             hint: '해질녘. 하늘이 타고 도시에 불이 들어오기 시작합니다.',
             hour: 18.4, glow: 1.1, win: 1.0, star: .7, vig: .95, sky: 1.0, haze: 1.2 },
    night: { name: '깜깜한 밤', en: 'NIGHT',
             hint: '표준 야경. 창문이 가장 많이 켜져 있고 도시가 가장 바쁜 시각.',
             hour: 21.6, glow: 1.0, win: 1.2, star: 1.0, vig: 1.0, sky: 1.0, haze: 1.0 },
    vibe:  { name: '분위기 있는 밤', en: 'AMBIENT',
             hint: '도시광이 하늘로 번지고 네온이 안개에 녹습니다. 불 끄고 보세요.',
             hour: 23.2, glow: 2.6, win: 1.15, star: .55, vig: 1.1, sky: 1.15, haze: 1.85 },
    pitch: { name: '칠흑같은 밤', en: 'PITCH',
             hint: '새벽 3시. 대부분의 불이 꺼지고 별과 달만 남습니다. 가장 적막한 화면.',
             hour: 3.1, glow: .22, win: .26, star: 2.4, vig: 1.55, sky: .5, haze: .62 },
  };

  /* ── 성장 속도 프리셋 ──────────────────────────────────────────────── */
  const PACES = {
    slow:   { name: '느긋하게', hint: '1억까지 약 50분. 밤새 틀어두는 스크린세이버용.', k: 0.16 },
    normal: { name: '보통',     hint: '1억까지 약 19분. 커피 한 잔이면 도시 하나.',     k: 0.42 },
    fast:   { name: '빠르게',   hint: '1억까지 약 7분. 눈에 보이게 층이 쌓입니다.',     k: 1.2 },
    surge:  { name: '폭주',     hint: '1억까지 약 2분. AGI가 브레이크를 놓았습니다.',   k: 4.0 },
  };

  root.SC_MAPS = { MAPS, MOODS, TIMES, PACES, _row: row };
})(typeof window !== 'undefined' ? window : globalThis);
