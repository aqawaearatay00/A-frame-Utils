<script>
  AFRAME.registerComponent('size', {
    schema: { type: 'string' },

    init: function () {
      const tag = this.el.tagName.toLowerCase();
      const raw = this.data.trim();

      // Parse input like "2 3", "2,3", or just "2"
      const parts = raw.split(/[\s,]+/).map(Number);
      let x = 1, y = 1, z = 1;

      if (parts.length === 1) {
        x = y = z = parts[0];
      } else {
        [x = 1, y = x, z = x] = parts;
      }

      const apply = (attrs) => {
        for (const [key, val] of Object.entries(attrs)) {
          if (val !== undefined && !Number.isNaN(val)) {
            this.el.setAttribute(key, val);
          }
        }
      };

      switch (tag) {
        case 'a-box':
          apply({ width: x, height: y, depth: z });
          break;

        case 'a-sphere':
        case 'a-dodecahedron':
        case 'a-octahedron':
        case 'a-tetrahedron':
        case 'a-icosahedron':
        case 'a-circle':
          apply({ radius: x });
          break;

        case 'a-cylinder':
          apply({ radius: x / 2, height: y });
          break;

        case 'a-cone':
          apply({
            'radius-bottom': x * 0.75,
            height: y,
            'radius-top': z * 0.1 // taper for realism
          });
          break;

        case 'a-torus':
        case 'a-torus-knot':
          apply({
            radius: x,
            'radius-tubular': x * 0.2
          });
          break;

        case 'a-plane':
          apply({ width: x, height: y });
          break;

        case 'a-ring':
          apply({
            'radius-outer': x,
            'radius-inner': x * 0.75
          });
          break;

        default:
          console.warn(`<${tag}> is not handled by 'size' component`);
      }
    }
  });
</script>
