export default class {
    public static VertexShader(): string {
        return `
            varying vec4 vPos;
            varying vec3 vNormal;
            varying vec2 vUv;

            void main() {
                vUv = uv;
                vNormal = normalMatrix * normal;
                vPos = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                gl_Position = vPos;
            }
        `;
    }

    public static FragmentShader(): string {
        return `
                varying vec4 vPos;
                varying vec3 vNormal;
                varying vec2 vUv;
  
                uniform float borderRadius;
                uniform float borderWidth;
                uniform vec2 size;
                uniform vec3 color;
                uniform vec3 borderColor;
  
                float getEdgeDist() {
                    vec2 ndc = vec2( vUv.x * 2.0 - 1.0, vUv.y * 2.0 - 1.0 );
                    vec2 planeSpaceCoord = vec2( size.x * 0.5 * ndc.x, size.y * 0.5 * ndc.y );
                    vec2 corner = size * 0.5;
                    vec2 offsetCorner = corner - abs( planeSpaceCoord );
                    float innerRadDist = min( offsetCorner.x, offsetCorner.y ) * -1.0;
                    float roundedDist = length( max( abs( planeSpaceCoord ) - size * 0.5 + borderRadius, 0.0 ) ) - borderRadius;
                    float s = step( innerRadDist * -1.0, borderRadius );
                    return mix( innerRadDist, roundedDist, s );
                }
  
                void main() {
                    float edgeDist = getEdgeDist();
                    if ( edgeDist > 0.0 ) discard;
                    vec3 finalColor = color;
                    if ( edgeDist * -1.0 < borderWidth ) finalColor = borderColor;
                    gl_FragColor = vec4( finalColor, 1 );
                }
        `;
    }
}