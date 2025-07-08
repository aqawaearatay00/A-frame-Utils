AFRAME.registerComponent('size', {
  schema: { type: 'string' },

  update: function () {
    const el = this.el;
    const tag = el.tagName.toLowerCase();
    const raw = this.data.trim();
    const parts = raw.split(/[\s,]+/).map(Number);

    const has = (i) => typeof parts[i] === 'number' && !isNaN(parts[i]);
    const x = has(0) ? parts[0] : 1;
    const y = has(1) ? parts[1] : x;
    const z = has(2) ? parts[2] : x;

    const base = el.getAttribute('geometry') || {};
    let attrs = {};

    switch (tag) {
      case 'a-box':
        attrs = { primitive: 'box', width: x, height: y, depth: z };
        break;

      case 'a-sphere':
      case 'a-circle':
      case 'a-dodecahedron':
      case 'a-octahedron':
      case 'a-tetrahedron':
      case 'a-icosahedron':
        attrs = { primitive: tag.replace('a-', ''), radius: x };
        break;

      case 'a-cylinder':
        attrs = { primitive: 'cylinder', radius: x / 2, height: y };
        break;

      case 'a-cone':
        attrs = {
          primitive: 'cone',
          height: y,
          'radius-bottom': x * 0.75,
          'radius-top': z * 0.1
        };
        break;

      case 'a-torus':
      case 'a-torus-knot':
        attrs = {
          primitive: tag.replace('a-', ''),
          radius: x,
          'segments-radial': 48,
          'segments-tubular': 64
        };

        if (has(1)) {
          attrs['radius-tubular'] = y;
        } else if ('radius-tubular' in base) {
          // Actively remove stale tubular value
          el.removeAttribute('geometry');
        }

        break;

      case 'a-plane':
        attrs = { primitive: 'plane', width: x, height: y };
        break;

      case 'a-ring':
        attrs = {
          primitive: 'ring',
          'radius-outer': x,
          'radius-inner': x * 0.75
        };
        break;

      default:
        console.warn(`<${tag}> is not handled by 'size' component`);
        return;
    }

    el.setAttribute('geometry', { ...base, ...attrs });
  }
});

