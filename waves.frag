precision mediump float;

varying vec2 vTexCoord;
uniform sampler2D tex0;

// Number of horizontal lines ('bands')
float band_count = 40.0;
float band_height = 1.0 / band_count;

// How thick the lines are
float spread_2 = pow(1.0/256.0, 2.0);        

// Min and max brightness of pixels
float d_max = 0.8;
float d_min = 0.2;

void main() {
  // Get screen position
  vec2 uv = vTexCoord;

  // Flip image right way up
  uv.y = 1.0 - uv.y;

  // Get rgb vals
  vec4 tex = texture2D(tex0, uv);

  // Get the lightness of the current band normalised 0-1
  // just use the pixel at the bottom cause I'm lazy
  float band_target = 
    min((d_max - d_min),
      max(0.0, 
        (tex.r+tex.g+tex.b)/3.0 - d_min
      )
    ) / (d_max - d_min);

  // Normalise lightness to band height, so pixel at height band_max_l in the
  // current band should be brightest
  float band_max_l = band_height * band_target;

  // Get our height in the band
  float band_pos = mod(uv.y, band_height);

  // Use quadratic with apropriate spread & min val of 0
  float dest = max(0.0, 
    (1.0 / spread_2) * (
      spread_2 - ((band_pos - band_max_l) * (band_pos - band_max_l))
      )
    );

  // Make frag colour from dest
  gl_FragColor = vec4(vec3(dest), 1.0);
} 