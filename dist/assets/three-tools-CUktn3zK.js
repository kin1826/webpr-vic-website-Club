import{r as b}from"./index-DzNU4h1B.js";import"./client-CpuMB12X.js";import{u as Pe,e as Tr,a as Ar,b as or,c as Sn,d as vr}from"./three-renderer-BctD-dpb.js";import{_ as We,H as _n,G as In}from"./decode-BX75Mi8L.js";import{I as yn,V as Ne,H as bn,q as Rn,Q as Cn,S as Ur,s as Nr,X as kr,K as xe,F as Le,Y as Ge,n as Ve,R as Mn,Z as xn,v as Tn,_ as An,$ as Un,m as Nn,D as kn,N as Bn,r as lr,t as Fn,a0 as Dn,C as On,a1 as zn,a2 as Ln,a3 as Pn,a4 as Zn,e as Gn,a5 as Hn}from"./three-core-BX2sTOVC.js";const Br=parseInt(yn.replace(/\D+/g,""));function Wn(t,o=Math.PI/3){const l=Math.cos(o),u=(1+1e-10)*100,c=[new Ne,new Ne,new Ne],S=new Ne,v=new Ne,y=new Ne,h=new Ne;function _(ee){const P=~~(ee.x*u),H=~~(ee.y*u),$=~~(ee.z*u);return`${P},${H},${$}`}const A=t.index?t.toNonIndexed():t,T=A.attributes.position,N={};for(let ee=0,P=T.count/3;ee<P;ee++){const H=3*ee,$=c[0].fromBufferAttribute(T,H+0),le=c[1].fromBufferAttribute(T,H+1),ie=c[2].fromBufferAttribute(T,H+2);S.subVectors(ie,le),v.subVectors($,le);const oe=new Ne().crossVectors(S,v).normalize();for(let q=0;q<3;q++){const se=c[q],g=_(se);g in N||(N[g]=[]),N[g].push(oe)}}const k=new Float32Array(T.count*3),fe=new bn(k,3,!1);for(let ee=0,P=T.count/3;ee<P;ee++){const H=3*ee,$=c[0].fromBufferAttribute(T,H+0),le=c[1].fromBufferAttribute(T,H+1),ie=c[2].fromBufferAttribute(T,H+2);S.subVectors(ie,le),v.subVectors($,le),y.crossVectors(S,v).normalize();for(let oe=0;oe<3;oe++){const q=c[oe],se=_(q),g=N[se];h.set(0,0,0);for(let C=0,x=g.length;C<x;C++){const z=g[C];y.dot(z)>l&&h.add(z)}h.normalize(),fe.setXYZ(H+oe,h.x,h.y,h.z)}}return A.setAttribute("normal",fe),A}var _e=Uint8Array,De=Uint16Array,fr=Uint32Array,Fr=new _e([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),Dr=new _e([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),Vn=new _e([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Or=function(t,o){for(var l=new De(31),u=0;u<31;++u)l[u]=o+=1<<t[u-1];for(var c=new fr(l[30]),u=1;u<30;++u)for(var S=l[u];S<l[u+1];++S)c[S]=S-l[u]<<5|u;return[l,c]},zr=Or(Fr,2),Lr=zr[0],Xn=zr[1];Lr[28]=258,Xn[258]=28;var $n=Or(Dr,0),Yn=$n[0],mr=new De(32768);for(var Q=0;Q<32768;++Q){var Fe=(Q&43690)>>>1|(Q&21845)<<1;Fe=(Fe&52428)>>>2|(Fe&13107)<<2,Fe=(Fe&61680)>>>4|(Fe&3855)<<4,mr[Q]=((Fe&65280)>>>8|(Fe&255)<<8)>>>1}var Qe=(function(t,o,l){for(var u=t.length,c=0,S=new De(o);c<u;++c)++S[t[c]-1];var v=new De(o);for(c=0;c<o;++c)v[c]=v[c-1]+S[c-1]<<1;var y;if(l){y=new De(1<<o);var h=15-o;for(c=0;c<u;++c)if(t[c])for(var _=c<<4|t[c],A=o-t[c],T=v[t[c]-1]++<<A,N=T|(1<<A)-1;T<=N;++T)y[mr[T]>>>h]=_}else for(y=new De(u),c=0;c<u;++c)t[c]&&(y[c]=mr[v[t[c]-1]++]>>>15-t[c]);return y}),rr=new _e(288);for(var Q=0;Q<144;++Q)rr[Q]=8;for(var Q=144;Q<256;++Q)rr[Q]=9;for(var Q=256;Q<280;++Q)rr[Q]=7;for(var Q=280;Q<288;++Q)rr[Q]=8;var Pr=new _e(32);for(var Q=0;Q<32;++Q)Pr[Q]=5;var Kn=Qe(rr,9,1),qn=Qe(Pr,5,1),cr=function(t){for(var o=t[0],l=1;l<t.length;++l)t[l]>o&&(o=t[l]);return o},be=function(t,o,l){var u=o/8|0;return(t[u]|t[u+1]<<8)>>(o&7)&l},ur=function(t,o){var l=o/8|0;return(t[l]|t[l+1]<<8|t[l+2]<<16)>>(o&7)},jn=function(t){return(t/8|0)+(t&7&&1)},Jn=function(t,o,l){(l==null||l>t.length)&&(l=t.length);var u=new(t instanceof De?De:t instanceof fr?fr:_e)(l-o);return u.set(t.subarray(o,l)),u},Qn=function(t,o,l){var u=t.length;if(!u||l&&!l.l&&u<5)return o||new _e(0);var c=!o||l,S=!l||l.i;l||(l={}),o||(o=new _e(u*3));var v=function(W){var Te=o.length;if(W>Te){var Ae=new _e(Math.max(Te*2,W));Ae.set(o),o=Ae}},y=l.f||0,h=l.p||0,_=l.b||0,A=l.l,T=l.d,N=l.m,k=l.n,fe=u*8;do{if(!A){l.f=y=be(t,h,1);var ee=be(t,h+1,3);if(h+=3,ee)if(ee==1)A=Kn,T=qn,N=9,k=5;else if(ee==2){var le=be(t,h,31)+257,ie=be(t,h+10,15)+4,oe=le+be(t,h+5,31)+1;h+=14;for(var q=new _e(oe),se=new _e(19),g=0;g<ie;++g)se[Vn[g]]=be(t,h+g*3,7);h+=ie*3;for(var C=cr(se),x=(1<<C)-1,z=Qe(se,C,1),g=0;g<oe;){var L=z[be(t,h,x)];h+=L&15;var P=L>>>4;if(P<16)q[g++]=P;else{var Z=0,U=0;for(P==16?(U=3+be(t,h,3),h+=2,Z=q[g-1]):P==17?(U=3+be(t,h,7),h+=3):P==18&&(U=11+be(t,h,127),h+=7);U--;)q[g++]=Z}}var re=q.subarray(0,le),D=q.subarray(le);N=cr(re),k=cr(D),A=Qe(re,N,1),T=Qe(D,k,1)}else throw"invalid block type";else{var P=jn(h)+4,H=t[P-4]|t[P-3]<<8,$=P+H;if($>u){if(S)throw"unexpected EOF";break}c&&v(_+H),o.set(t.subarray(P,$),_),l.b=_+=H,l.p=h=$*8;continue}if(h>fe){if(S)throw"unexpected EOF";break}}c&&v(_+131072);for(var Ie=(1<<N)-1,Oe=(1<<k)-1,ye=h;;ye=h){var Z=A[ur(t,h)&Ie],j=Z>>>4;if(h+=Z&15,h>fe){if(S)throw"unexpected EOF";break}if(!Z)throw"invalid length/literal";if(j<256)o[_++]=j;else if(j==256){ye=h,A=null;break}else{var ke=j-254;if(j>264){var g=j-257,ne=Fr[g];ke=be(t,h,(1<<ne)-1)+Lr[g],h+=ne}var ve=T[ur(t,h)&Oe],Re=ve>>>4;if(!ve)throw"invalid distance";h+=ve&15;var D=Yn[Re];if(Re>3){var ne=Dr[Re];D+=ur(t,h)&(1<<ne)-1,h+=ne}if(h>fe){if(S)throw"unexpected EOF";break}c&&v(_+131072);for(var Xe=_+ke;_<Xe;_+=4)o[_]=o[_-D],o[_+1]=o[_+1-D],o[_+2]=o[_+2-D],o[_+3]=o[_+3-D];_=Xe}}l.l=A,l.p=ye,l.b=_,A&&(y=1,l.m=N,l.d=T,l.n=k)}while(!y);return _==o.length?o:Jn(o,0,_)},et=new _e(0),rt=function(t){if((t[0]&15)!=8||t[0]>>>4>7||(t[0]<<8|t[1])%31)throw"invalid zlib data";if(t[1]&32)throw"invalid zlib data: preset dictionaries not supported"};function ar(t,o){return Qn((rt(t),t.subarray(2,-4)),o)}var nt=typeof TextDecoder<"u"&&new TextDecoder,tt=0;try{nt.decode(et,{stream:!0}),tt=1}catch{}const at=t=>t&&t.isCubeTexture;class ot extends Rn{constructor(o,l){var u,c;const S=at(o),y=((c=S?(u=o.image[0])==null?void 0:u.width:o.image.width)!=null?c:1024)/4,h=Math.floor(Math.log2(y)),_=Math.pow(2,h),A=3*Math.max(_,112),T=4*_,N=[S?"#define ENVMAP_TYPE_CUBE":"",`#define CUBEUV_TEXEL_WIDTH ${1/A}`,`#define CUBEUV_TEXEL_HEIGHT ${1/T}`,`#define CUBEUV_MAX_MIP ${h}.0`],k=`
        varying vec3 vWorldPosition;
        void main() 
        {
            vec4 worldPosition = ( modelMatrix * vec4( position, 1.0 ) );
            vWorldPosition = worldPosition.xyz;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
        `,fe=N.join(`
`)+`
        #define ENVMAP_TYPE_CUBE_UV
        varying vec3 vWorldPosition;
        uniform float radius;
        uniform float height;
        uniform float angle;
        #ifdef ENVMAP_TYPE_CUBE
            uniform samplerCube map;
        #else
            uniform sampler2D map;
        #endif
        // From: https://www.shadertoy.com/view/4tsBD7
        float diskIntersectWithBackFaceCulling( vec3 ro, vec3 rd, vec3 c, vec3 n, float r ) 
        {
            float d = dot ( rd, n );
            
            if( d > 0.0 ) { return 1e6; }
            
            vec3  o = ro - c;
            float t = - dot( n, o ) / d;
            vec3  q = o + rd * t;
            
            return ( dot( q, q ) < r * r ) ? t : 1e6;
        }
        // From: https://www.iquilezles.org/www/articles/intersectors/intersectors.htm
        float sphereIntersect( vec3 ro, vec3 rd, vec3 ce, float ra ) 
        {
            vec3 oc = ro - ce;
            float b = dot( oc, rd );
            float c = dot( oc, oc ) - ra * ra;
            float h = b * b - c;
            
            if( h < 0.0 ) { return -1.0; }
            
            h = sqrt( h );
            
            return - b + h;
        }
        vec3 project() 
        {
            vec3 p = normalize( vWorldPosition );
            vec3 camPos = cameraPosition;
            camPos.y -= height;
            float intersection = sphereIntersect( camPos, p, vec3( 0.0 ), radius );
            if( intersection > 0.0 ) {
                
                vec3 h = vec3( 0.0, - height, 0.0 );
                float intersection2 = diskIntersectWithBackFaceCulling( camPos, p, h, vec3( 0.0, 1.0, 0.0 ), radius );
                p = ( camPos + min( intersection, intersection2 ) * p ) / radius;
            } else {
                p = vec3( 0.0, 1.0, 0.0 );
            }
            return p;
        }
        #include <common>
        #include <cube_uv_reflection_fragment>
        void main() 
        {
            vec3 projectedWorldPosition = project();
            
            #ifdef ENVMAP_TYPE_CUBE
                vec3 outcolor = textureCube( map, projectedWorldPosition ).rgb;
            #else
                vec3 direction = normalize( projectedWorldPosition );
                vec2 uv = equirectUv( direction );
                vec3 outcolor = texture2D( map, uv ).rgb;
            #endif
            gl_FragColor = vec4( outcolor, 1.0 );
            #include <tonemapping_fragment>
            #include <${Br>=154?"colorspace_fragment":"encodings_fragment"}>
        }
        `,ee={map:{value:o},height:{value:l?.height||15},radius:{value:l?.radius||100}},P=new Cn(1,16),H=new Ur({uniforms:ee,fragmentShader:fe,vertexShader:k,side:Nr});super(P,H)}set radius(o){this.material.uniforms.radius.value=o}get radius(){return this.material.uniforms.radius.value}set height(o){this.material.uniforms.height.value=o}get height(){return this.material.uniforms.height.value}}class it extends kr{constructor(o){super(o),this.type=xe}parse(o){const v=function(g,C){switch(g){case 1:throw new Error("THREE.RGBELoader: Read Error: "+(C||""));case 2:throw new Error("THREE.RGBELoader: Write Error: "+(C||""));case 3:throw new Error("THREE.RGBELoader: Bad File Format: "+(C||""));default:case 4:throw new Error("THREE.RGBELoader: Memory Error: "+(C||""))}},T=function(g,C,x){C=C||1024;let L=g.pos,Z=-1,U=0,re="",D=String.fromCharCode.apply(null,new Uint16Array(g.subarray(L,L+128)));for(;0>(Z=D.indexOf(`
`))&&U<C&&L<g.byteLength;)re+=D,U+=D.length,L+=128,D+=String.fromCharCode.apply(null,new Uint16Array(g.subarray(L,L+128)));return-1<Z?(g.pos+=U+Z+1,re+D.slice(0,Z)):!1},N=function(g){const C=/^#\?(\S+)/,x=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,z=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,L=/^\s*FORMAT=(\S+)\s*$/,Z=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,U={valid:0,string:"",comments:"",programtype:"RGBE",format:"",gamma:1,exposure:1,width:0,height:0};let re,D;for((g.pos>=g.byteLength||!(re=T(g)))&&v(1,"no header found"),(D=re.match(C))||v(3,"bad initial token"),U.valid|=1,U.programtype=D[1],U.string+=re+`
`;re=T(g),re!==!1;){if(U.string+=re+`
`,re.charAt(0)==="#"){U.comments+=re+`
`;continue}if((D=re.match(x))&&(U.gamma=parseFloat(D[1])),(D=re.match(z))&&(U.exposure=parseFloat(D[1])),(D=re.match(L))&&(U.valid|=2,U.format=D[1]),(D=re.match(Z))&&(U.valid|=4,U.height=parseInt(D[1],10),U.width=parseInt(D[2],10)),U.valid&2&&U.valid&4)break}return U.valid&2||v(3,"missing format specifier"),U.valid&4||v(3,"missing image size specifier"),U},k=function(g,C,x){const z=C;if(z<8||z>32767||g[0]!==2||g[1]!==2||g[2]&128)return new Uint8Array(g);z!==(g[2]<<8|g[3])&&v(3,"wrong scanline width");const L=new Uint8Array(4*C*x);L.length||v(4,"unable to allocate buffer space");let Z=0,U=0;const re=4*z,D=new Uint8Array(4),Ie=new Uint8Array(re);let Oe=x;for(;Oe>0&&U<g.byteLength;){U+4>g.byteLength&&v(1),D[0]=g[U++],D[1]=g[U++],D[2]=g[U++],D[3]=g[U++],(D[0]!=2||D[1]!=2||(D[2]<<8|D[3])!=z)&&v(3,"bad rgbe scanline format");let ye=0,j;for(;ye<re&&U<g.byteLength;){j=g[U++];const ne=j>128;if(ne&&(j-=128),(j===0||ye+j>re)&&v(3,"bad scanline data"),ne){const ve=g[U++];for(let Re=0;Re<j;Re++)Ie[ye++]=ve}else Ie.set(g.subarray(U,U+j),ye),ye+=j,U+=j}const ke=z;for(let ne=0;ne<ke;ne++){let ve=0;L[Z]=Ie[ne+ve],ve+=z,L[Z+1]=Ie[ne+ve],ve+=z,L[Z+2]=Ie[ne+ve],ve+=z,L[Z+3]=Ie[ne+ve],Z+=4}Oe--}return L},fe=function(g,C,x,z){const L=g[C+3],Z=Math.pow(2,L-128)/255;x[z+0]=g[C+0]*Z,x[z+1]=g[C+1]*Z,x[z+2]=g[C+2]*Z,x[z+3]=1},ee=function(g,C,x,z){const L=g[C+3],Z=Math.pow(2,L-128)/255;x[z+0]=Ge.toHalfFloat(Math.min(g[C+0]*Z,65504)),x[z+1]=Ge.toHalfFloat(Math.min(g[C+1]*Z,65504)),x[z+2]=Ge.toHalfFloat(Math.min(g[C+2]*Z,65504)),x[z+3]=Ge.toHalfFloat(1)},P=new Uint8Array(o);P.pos=0;const H=N(P),$=H.width,le=H.height,ie=k(P.subarray(P.pos),$,le);let oe,q,se;switch(this.type){case Le:se=ie.length/4;const g=new Float32Array(se*4);for(let x=0;x<se;x++)fe(ie,x*4,g,x*4);oe=g,q=Le;break;case xe:se=ie.length/4;const C=new Uint16Array(se*4);for(let x=0;x<se;x++)ee(ie,x*4,C,x*4);oe=C,q=xe;break;default:throw new Error("THREE.RGBELoader: Unsupported type: "+this.type)}return{width:$,height:le,data:oe,header:H.string,gamma:H.gamma,exposure:H.exposure,type:q}}setDataType(o){return this.type=o,this}load(o,l,u,c){function S(v,y){switch(v.type){case Le:case xe:"colorSpace"in v?v.colorSpace="srgb-linear":v.encoding=3e3,v.minFilter=Ve,v.magFilter=Ve,v.generateMipmaps=!1,v.flipY=!0;break}l&&l(v,y)}return super.load(o,S,u,c)}}const Je=Br>=152;class st extends kr{constructor(o){super(o),this.type=xe}parse(o){const C=Math.pow(2.7182818,2.2);function x(e,r){for(var n=0,a=0;a<65536;++a)(a==0||e[a>>3]&1<<(a&7))&&(r[n++]=a);for(var i=n-1;n<65536;)r[n++]=0;return i}function z(e){for(var r=0;r<16384;r++)e[r]={},e[r].len=0,e[r].lit=0,e[r].p=null}const L={l:0,c:0,lc:0};function Z(e,r,n,a,i){for(;n<e;)r=r<<8|Cr(a,i),n+=8;n-=e,L.l=r>>n&(1<<e)-1,L.c=r,L.lc=n}const U=new Array(59);function re(e){for(var r=0;r<=58;++r)U[r]=0;for(var r=0;r<65537;++r)U[e[r]]+=1;for(var n=0,r=58;r>0;--r){var a=n+U[r]>>1;U[r]=n,n=a}for(var r=0;r<65537;++r){var i=e[r];i>0&&(e[r]=i|U[i]++<<6)}}function D(e,r,n,a,i,s,m){for(var f=n,E=0,d=0;i<=s;i++){if(f.value-n.value>a)return!1;Z(6,E,d,e,f);var w=L.l;if(E=L.c,d=L.lc,m[i]=w,w==63){if(f.value-n.value>a)throw"Something wrong with hufUnpackEncTable";Z(8,E,d,e,f);var p=L.l+6;if(E=L.c,d=L.lc,i+p>s+1)throw"Something wrong with hufUnpackEncTable";for(;p--;)m[i++]=0;i--}else if(w>=59){var p=w-59+2;if(i+p>s+1)throw"Something wrong with hufUnpackEncTable";for(;p--;)m[i++]=0;i--}}re(m)}function Ie(e){return e&63}function Oe(e){return e>>6}function ye(e,r,n,a){for(;r<=n;r++){var i=Oe(e[r]),s=Ie(e[r]);if(i>>s)throw"Invalid table entry";if(s>14){var m=a[i>>s-14];if(m.len)throw"Invalid table entry";if(m.lit++,m.p){var f=m.p;m.p=new Array(m.lit);for(var E=0;E<m.lit-1;++E)m.p[E]=f[E]}else m.p=new Array(1);m.p[m.lit-1]=r}else if(s)for(var d=0,E=1<<14-s;E>0;E--){var m=a[(i<<14-s)+d];if(m.len||m.p)throw"Invalid table entry";m.len=s,m.lit=r,d++}}return!0}const j={c:0,lc:0};function ke(e,r,n,a){e=e<<8|Cr(n,a),r+=8,j.c=e,j.lc=r}const ne={c:0,lc:0};function ve(e,r,n,a,i,s,m,f,E,d){if(e==r){a<8&&(ke(n,a,i,m),n=j.c,a=j.lc),a-=8;var w=n>>a,w=new Uint8Array([w])[0];if(E.value+w>d)return!1;for(var p=f[E.value-1];w-- >0;)f[E.value++]=p}else if(E.value<d)f[E.value++]=e;else return!1;ne.c=n,ne.lc=a}function Re(e){return e&65535}function Xe(e){var r=Re(e);return r>32767?r-65536:r}const W={a:0,b:0};function Te(e,r){var n=Xe(e),a=Xe(r),i=a,s=n+(i&1)+(i>>1),m=s,f=s-i;W.a=m,W.b=f}function Ae(e,r){var n=Re(e),a=Re(r),i=n-(a>>1)&65535,s=a+i-32768&65535;W.a=s,W.b=i}function Hr(e,r,n,a,i,s,m){for(var f=m<16384,E=n>i?i:n,d=1,w;d<=E;)d<<=1;for(d>>=1,w=d,d>>=1;d>=1;){for(var p=0,ae=p+s*(i-w),R=s*d,M=s*w,B=a*d,F=a*w,V,Y,ce,pe;p<=ae;p+=M){for(var K=p,Ce=p+a*(n-w);K<=Ce;K+=F){var J=K+B,ue=K+R,Ue=ue+B;f?(Te(e[K+r],e[ue+r]),V=W.a,ce=W.b,Te(e[J+r],e[Ue+r]),Y=W.a,pe=W.b,Te(V,Y),e[K+r]=W.a,e[J+r]=W.b,Te(ce,pe),e[ue+r]=W.a,e[Ue+r]=W.b):(Ae(e[K+r],e[ue+r]),V=W.a,ce=W.b,Ae(e[J+r],e[Ue+r]),Y=W.a,pe=W.b,Ae(V,Y),e[K+r]=W.a,e[J+r]=W.b,Ae(ce,pe),e[ue+r]=W.a,e[Ue+r]=W.b)}if(n&d){var ue=K+R;f?Te(e[K+r],e[ue+r]):Ae(e[K+r],e[ue+r]),V=W.a,e[ue+r]=W.b,e[K+r]=V}}if(i&d)for(var K=p,Ce=p+a*(n-w);K<=Ce;K+=F){var J=K+B;f?Te(e[K+r],e[J+r]):Ae(e[K+r],e[J+r]),V=W.a,e[J+r]=W.b,e[K+r]=V}w=d,d>>=1}return p}function Wr(e,r,n,a,i,s,m,f,E,d){for(var w=0,p=0,ae=f,R=Math.trunc(i.value+(s+7)/8);i.value<R;)for(ke(w,p,n,i),w=j.c,p=j.lc;p>=14;){var M=w>>p-14&16383,B=r[M];if(B.len)p-=B.len,ve(B.lit,m,w,p,n,a,i,E,d,ae),w=ne.c,p=ne.lc;else{if(!B.p)throw"hufDecode issues";var F;for(F=0;F<B.lit;F++){for(var V=Ie(e[B.p[F]]);p<V&&i.value<R;)ke(w,p,n,i),w=j.c,p=j.lc;if(p>=V&&Oe(e[B.p[F]])==(w>>p-V&(1<<V)-1)){p-=V,ve(B.p[F],m,w,p,n,a,i,E,d,ae),w=ne.c,p=ne.lc;break}}if(F==B.lit)throw"hufDecode issues"}}var Y=8-s&7;for(w>>=Y,p-=Y;p>0;){var B=r[w<<14-p&16383];if(B.len)p-=B.len,ve(B.lit,m,w,p,n,a,i,E,d,ae),w=ne.c,p=ne.lc;else throw"hufDecode issues"}return!0}function Sr(e,r,n,a,i,s){var m={value:0},f=n.value,E=de(r,n),d=de(r,n);n.value+=4;var w=de(r,n);if(n.value+=4,E<0||E>=65537||d<0||d>=65537)throw"Something wrong with HUF_ENCSIZE";var p=new Array(65537),ae=new Array(16384);z(ae);var R=a-(n.value-f);if(D(e,r,n,R,E,d,p),w>8*(a-(n.value-f)))throw"Something wrong with hufUncompress";ye(p,E,d,ae),Wr(p,ae,e,r,n,w,d,s,i,m)}function Vr(e,r,n){for(var a=0;a<n;++a)r[a]=e[r[a]]}function _r(e){for(var r=1;r<e.length;r++){var n=e[r-1]+e[r]-128;e[r]=n}}function Ir(e,r){for(var n=0,a=Math.floor((e.length+1)/2),i=0,s=e.length-1;!(i>s||(r[i++]=e[n++],i>s));)r[i++]=e[a++]}function yr(e){for(var r=e.byteLength,n=new Array,a=0,i=new DataView(e);r>0;){var s=i.getInt8(a++);if(s<0){var m=-s;r-=m+1;for(var f=0;f<m;f++)n.push(i.getUint8(a++))}else{var m=s;r-=2;for(var E=i.getUint8(a++),f=0;f<m+1;f++)n.push(E)}}return n}function Xr(e,r,n,a,i,s){var J=new DataView(s.buffer),m=n[e.idx[0]].width,f=n[e.idx[0]].height,E=3,d=Math.floor(m/8),w=Math.ceil(m/8),p=Math.ceil(f/8),ae=m-(w-1)*8,R=f-(p-1)*8,M={value:0},B=new Array(E),F=new Array(E),V=new Array(E),Y=new Array(E),ce=new Array(E);for(let X=0;X<E;++X)ce[X]=r[e.idx[X]],B[X]=X<1?0:B[X-1]+w*p,F[X]=new Float32Array(64),V[X]=new Uint16Array(64),Y[X]=new Uint16Array(w*64);for(let X=0;X<p;++X){var pe=8;X==p-1&&(pe=R);var K=8;for(let te=0;te<w;++te){te==w-1&&(K=ae);for(let G=0;G<E;++G)V[G].fill(0),V[G][0]=i[B[G]++],$r(M,a,V[G]),Yr(V[G],F[G]),Kr(F[G]);qr(F);for(let G=0;G<E;++G)jr(F[G],Y[G],te*64)}let he=0;for(let te=0;te<E;++te){const G=n[e.idx[te]].type;for(let Se=8*X;Se<8*X+pe;++Se){he=ce[te][Se];for(let ze=0;ze<d;++ze){const ge=ze*64+(Se&7)*8;J.setUint16(he+0*G,Y[te][ge+0],!0),J.setUint16(he+2*G,Y[te][ge+1],!0),J.setUint16(he+4*G,Y[te][ge+2],!0),J.setUint16(he+6*G,Y[te][ge+3],!0),J.setUint16(he+8*G,Y[te][ge+4],!0),J.setUint16(he+10*G,Y[te][ge+5],!0),J.setUint16(he+12*G,Y[te][ge+6],!0),J.setUint16(he+14*G,Y[te][ge+7],!0),he+=16*G}}if(d!=w)for(let Se=8*X;Se<8*X+pe;++Se){const ze=ce[te][Se]+8*d*2*G,ge=d*64+(Se&7)*8;for(let Be=0;Be<K;++Be)J.setUint16(ze+Be*2*G,Y[te][ge+Be],!0)}}}for(var Ce=new Uint16Array(m),J=new DataView(s.buffer),ue=0;ue<E;++ue){n[e.idx[ue]].decoded=!0;var Ue=n[e.idx[ue]].type;if(n[ue].type==2)for(var je=0;je<f;++je){const X=ce[ue][je];for(var we=0;we<m;++we)Ce[we]=J.getUint16(X+we*2*Ue,!0);for(var we=0;we<m;++we)J.setFloat32(X+we*2*Ue,I(Ce[we]),!0)}}}function $r(e,r,n){for(var a,i=1;i<64;)a=r[e.value],a==65280?i=64:a>>8==255?i+=a&255:(n[i]=a,i++),e.value++}function Yr(e,r){r[0]=I(e[0]),r[1]=I(e[1]),r[2]=I(e[5]),r[3]=I(e[6]),r[4]=I(e[14]),r[5]=I(e[15]),r[6]=I(e[27]),r[7]=I(e[28]),r[8]=I(e[2]),r[9]=I(e[4]),r[10]=I(e[7]),r[11]=I(e[13]),r[12]=I(e[16]),r[13]=I(e[26]),r[14]=I(e[29]),r[15]=I(e[42]),r[16]=I(e[3]),r[17]=I(e[8]),r[18]=I(e[12]),r[19]=I(e[17]),r[20]=I(e[25]),r[21]=I(e[30]),r[22]=I(e[41]),r[23]=I(e[43]),r[24]=I(e[9]),r[25]=I(e[11]),r[26]=I(e[18]),r[27]=I(e[24]),r[28]=I(e[31]),r[29]=I(e[40]),r[30]=I(e[44]),r[31]=I(e[53]),r[32]=I(e[10]),r[33]=I(e[19]),r[34]=I(e[23]),r[35]=I(e[32]),r[36]=I(e[39]),r[37]=I(e[45]),r[38]=I(e[52]),r[39]=I(e[54]),r[40]=I(e[20]),r[41]=I(e[22]),r[42]=I(e[33]),r[43]=I(e[38]),r[44]=I(e[46]),r[45]=I(e[51]),r[46]=I(e[55]),r[47]=I(e[60]),r[48]=I(e[21]),r[49]=I(e[34]),r[50]=I(e[37]),r[51]=I(e[47]),r[52]=I(e[50]),r[53]=I(e[56]),r[54]=I(e[59]),r[55]=I(e[61]),r[56]=I(e[35]),r[57]=I(e[36]),r[58]=I(e[48]),r[59]=I(e[49]),r[60]=I(e[57]),r[61]=I(e[58]),r[62]=I(e[62]),r[63]=I(e[63])}function Kr(e){const r=.5*Math.cos(.7853975),n=.5*Math.cos(3.14159/16),a=.5*Math.cos(3.14159/8),i=.5*Math.cos(3*3.14159/16),s=.5*Math.cos(5*3.14159/16),m=.5*Math.cos(3*3.14159/8),f=.5*Math.cos(7*3.14159/16);for(var E=new Array(4),d=new Array(4),w=new Array(4),p=new Array(4),ae=0;ae<8;++ae){var R=ae*8;E[0]=a*e[R+2],E[1]=m*e[R+2],E[2]=a*e[R+6],E[3]=m*e[R+6],d[0]=n*e[R+1]+i*e[R+3]+s*e[R+5]+f*e[R+7],d[1]=i*e[R+1]-f*e[R+3]-n*e[R+5]-s*e[R+7],d[2]=s*e[R+1]-n*e[R+3]+f*e[R+5]+i*e[R+7],d[3]=f*e[R+1]-s*e[R+3]+i*e[R+5]-n*e[R+7],w[0]=r*(e[R+0]+e[R+4]),w[3]=r*(e[R+0]-e[R+4]),w[1]=E[0]+E[3],w[2]=E[1]-E[2],p[0]=w[0]+w[1],p[1]=w[3]+w[2],p[2]=w[3]-w[2],p[3]=w[0]-w[1],e[R+0]=p[0]+d[0],e[R+1]=p[1]+d[1],e[R+2]=p[2]+d[2],e[R+3]=p[3]+d[3],e[R+4]=p[3]-d[3],e[R+5]=p[2]-d[2],e[R+6]=p[1]-d[1],e[R+7]=p[0]-d[0]}for(var M=0;M<8;++M)E[0]=a*e[16+M],E[1]=m*e[16+M],E[2]=a*e[48+M],E[3]=m*e[48+M],d[0]=n*e[8+M]+i*e[24+M]+s*e[40+M]+f*e[56+M],d[1]=i*e[8+M]-f*e[24+M]-n*e[40+M]-s*e[56+M],d[2]=s*e[8+M]-n*e[24+M]+f*e[40+M]+i*e[56+M],d[3]=f*e[8+M]-s*e[24+M]+i*e[40+M]-n*e[56+M],w[0]=r*(e[M]+e[32+M]),w[3]=r*(e[M]-e[32+M]),w[1]=E[0]+E[3],w[2]=E[1]-E[2],p[0]=w[0]+w[1],p[1]=w[3]+w[2],p[2]=w[3]-w[2],p[3]=w[0]-w[1],e[0+M]=p[0]+d[0],e[8+M]=p[1]+d[1],e[16+M]=p[2]+d[2],e[24+M]=p[3]+d[3],e[32+M]=p[3]-d[3],e[40+M]=p[2]-d[2],e[48+M]=p[1]-d[1],e[56+M]=p[0]-d[0]}function qr(e){for(var r=0;r<64;++r){var n=e[0][r],a=e[1][r],i=e[2][r];e[0][r]=n+1.5747*i,e[1][r]=n-.1873*a-.4682*i,e[2][r]=n+1.8556*a}}function jr(e,r,n){for(var a=0;a<64;++a)r[n+a]=Ge.toHalfFloat(Jr(e[a]))}function Jr(e){return e<=1?Math.sign(e)*Math.pow(Math.abs(e),2.2):Math.sign(e)*Math.pow(C,Math.abs(e)-1)}function br(e){return new DataView(e.array.buffer,e.offset.value,e.size)}function Qr(e){var r=e.viewer.buffer.slice(e.offset.value,e.offset.value+e.size),n=new Uint8Array(yr(r)),a=new Uint8Array(n.length);return _r(n),Ir(n,a),new DataView(a.buffer)}function sr(e){var r=e.array.slice(e.offset.value,e.offset.value+e.size),n=ar(r),a=new Uint8Array(n.length);return _r(n),Ir(n,a),new DataView(a.buffer)}function en(e){for(var r=e.viewer,n={value:e.offset.value},a=new Uint16Array(e.width*e.scanlineBlockSize*(e.channels*e.type)),i=new Uint8Array(8192),s=0,m=new Array(e.channels),f=0;f<e.channels;f++)m[f]={},m[f].start=s,m[f].end=m[f].start,m[f].nx=e.width,m[f].ny=e.lines,m[f].size=e.type,s+=m[f].nx*m[f].ny*m[f].size;var E=Ye(r,n),d=Ye(r,n);if(d>=8192)throw"Something is wrong with PIZ_COMPRESSION BITMAP_SIZE";if(E<=d)for(var f=0;f<d-E+1;f++)i[f+E]=Ze(r,n);var w=new Uint16Array(65536),p=x(i,w),ae=de(r,n);Sr(e.array,r,n,ae,a,s);for(var f=0;f<e.channels;++f)for(var R=m[f],M=0;M<m[f].size;++M)Hr(a,R.start+M,R.nx,R.size,R.ny,R.nx*R.size,p);Vr(w,a,s);for(var B=0,F=new Uint8Array(a.buffer.byteLength),V=0;V<e.lines;V++)for(var Y=0;Y<e.channels;Y++){var R=m[Y],ce=R.nx*R.size,pe=new Uint8Array(a.buffer,R.end*2,ce*2);F.set(pe,B),B+=ce*2,R.end+=ce}return new DataView(F.buffer)}function rn(e){var r=e.array.slice(e.offset.value,e.offset.value+e.size),n=ar(r);const a=e.lines*e.channels*e.width,i=e.type==1?new Uint16Array(a):new Uint32Array(a);let s=0,m=0;const f=new Array(4);for(let E=0;E<e.lines;E++)for(let d=0;d<e.channels;d++){let w=0;switch(e.type){case 1:f[0]=s,f[1]=f[0]+e.width,s=f[1]+e.width;for(let p=0;p<e.width;++p){const ae=n[f[0]++]<<8|n[f[1]++];w+=ae,i[m]=w,m++}break;case 2:f[0]=s,f[1]=f[0]+e.width,f[2]=f[1]+e.width,s=f[2]+e.width;for(let p=0;p<e.width;++p){const ae=n[f[0]++]<<24|n[f[1]++]<<16|n[f[2]++]<<8;w+=ae,i[m]=w,m++}break}}return new DataView(i.buffer)}function Rr(e){var r=e.viewer,n={value:e.offset.value},a=new Uint8Array(e.width*e.lines*(e.channels*e.type*2)),i={version:Ee(r,n),unknownUncompressedSize:Ee(r,n),unknownCompressedSize:Ee(r,n),acCompressedSize:Ee(r,n),dcCompressedSize:Ee(r,n),rleCompressedSize:Ee(r,n),rleUncompressedSize:Ee(r,n),rleRawSize:Ee(r,n),totalAcUncompressedCount:Ee(r,n),totalDcUncompressedCount:Ee(r,n),acCompression:Ee(r,n)};if(i.version<2)throw"EXRLoader.parse: "+qe.compression+" version "+i.version+" is unsupported";for(var s=new Array,m=Ye(r,n)-2;m>0;){var f=nr(r.buffer,n),E=Ze(r,n),d=E>>2&3,w=(E>>4)-1,p=new Int8Array([w])[0],ae=Ze(r,n);s.push({name:f,index:p,type:ae,compression:d}),m-=f.length+3}for(var R=qe.channels,M=new Array(e.channels),B=0;B<e.channels;++B){var F=M[B]={},V=R[B];F.name=V.name,F.compression=0,F.decoded=!1,F.type=V.pixelType,F.pLinear=V.pLinear,F.width=e.width,F.height=e.lines}for(var Y={idx:new Array(3)},ce=0;ce<e.channels;++ce)for(var F=M[ce],B=0;B<s.length;++B){var pe=s[B];F.name==pe.name&&(F.compression=pe.compression,pe.index>=0&&(Y.idx[pe.index]=ce),F.offset=ce)}if(i.acCompressedSize>0)switch(i.acCompression){case 0:var J=new Uint16Array(i.totalAcUncompressedCount);Sr(e.array,r,n,i.acCompressedSize,J,i.totalAcUncompressedCount);break;case 1:var K=e.array.slice(n.value,n.value+i.totalAcUncompressedCount),Ce=ar(K),J=new Uint16Array(Ce.buffer);n.value+=i.totalAcUncompressedCount;break}if(i.dcCompressedSize>0){var ue={array:e.array,offset:n,size:i.dcCompressedSize},Ue=new Uint16Array(sr(ue).buffer);n.value+=i.dcCompressedSize}if(i.rleRawSize>0){var K=e.array.slice(n.value,n.value+i.rleCompressedSize),Ce=ar(K),je=yr(Ce.buffer);n.value+=i.rleCompressedSize}for(var we=0,X=new Array(M.length),B=0;B<X.length;++B)X[B]=new Array;for(var he=0;he<e.lines;++he)for(var te=0;te<M.length;++te)X[te].push(we),we+=M[te].width*e.type*2;Xr(Y,X,M,J,Ue,a);for(var B=0;B<M.length;++B){var F=M[B];if(!F.decoded)switch(F.compression){case 2:for(var G=0,Se=0,he=0;he<e.lines;++he){for(var ze=X[B][G],ge=0;ge<F.width;++ge){for(var Be=0;Be<2*F.type;++Be)a[ze++]=je[Se+Be*F.width*F.height];Se++}G++}break;default:throw"EXRLoader.parse: unsupported channel compression"}}return new DataView(a.buffer)}function nr(e,r){for(var n=new Uint8Array(e),a=0;n[r.value+a]!=0;)a+=1;var i=new TextDecoder().decode(n.slice(r.value,r.value+a));return r.value=r.value+a+1,i}function nn(e,r,n){var a=new TextDecoder().decode(new Uint8Array(e).slice(r.value,r.value+n));return r.value=r.value+n,a}function tn(e,r){var n=$e(e,r),a=de(e,r);return[n,a]}function an(e,r){var n=de(e,r),a=de(e,r);return[n,a]}function $e(e,r){var n=e.getInt32(r.value,!0);return r.value=r.value+4,n}function de(e,r){var n=e.getUint32(r.value,!0);return r.value=r.value+4,n}function Cr(e,r){var n=e[r.value];return r.value=r.value+1,n}function Ze(e,r){var n=e.getUint8(r.value);return r.value=r.value+1,n}const Ee=function(e,r){let n;return"getBigInt64"in DataView.prototype?n=Number(e.getBigInt64(r.value,!0)):n=e.getUint32(r.value+4,!0)+Number(e.getUint32(r.value,!0)<<32),r.value+=8,n};function me(e,r){var n=e.getFloat32(r.value,!0);return r.value+=4,n}function on(e,r){return Ge.toHalfFloat(me(e,r))}function I(e){var r=(e&31744)>>10,n=e&1023;return(e>>15?-1:1)*(r?r===31?n?NaN:1/0:Math.pow(2,r-15)*(1+n/1024):6103515625e-14*(n/1024))}function Ye(e,r){var n=e.getUint16(r.value,!0);return r.value+=2,n}function sn(e,r){return I(Ye(e,r))}function ln(e,r,n,a){for(var i=n.value,s=[];n.value<i+a-1;){var m=nr(r,n),f=$e(e,n),E=Ze(e,n);n.value+=3;var d=$e(e,n),w=$e(e,n);s.push({name:m,pixelType:f,pLinear:E,xSampling:d,ySampling:w})}return n.value+=1,s}function cn(e,r){var n=me(e,r),a=me(e,r),i=me(e,r),s=me(e,r),m=me(e,r),f=me(e,r),E=me(e,r),d=me(e,r);return{redX:n,redY:a,greenX:i,greenY:s,blueX:m,blueY:f,whiteX:E,whiteY:d}}function un(e,r){var n=["NO_COMPRESSION","RLE_COMPRESSION","ZIPS_COMPRESSION","ZIP_COMPRESSION","PIZ_COMPRESSION","PXR24_COMPRESSION","B44_COMPRESSION","B44A_COMPRESSION","DWAA_COMPRESSION","DWAB_COMPRESSION"],a=Ze(e,r);return n[a]}function vn(e,r){var n=de(e,r),a=de(e,r),i=de(e,r),s=de(e,r);return{xMin:n,yMin:a,xMax:i,yMax:s}}function fn(e,r){var n=["INCREASING_Y"],a=Ze(e,r);return n[a]}function mn(e,r){var n=me(e,r),a=me(e,r);return[n,a]}function hn(e,r){var n=me(e,r),a=me(e,r),i=me(e,r);return[n,a,i]}function pn(e,r,n,a,i){if(a==="string"||a==="stringvector"||a==="iccProfile")return nn(r,n,i);if(a==="chlist")return ln(e,r,n,i);if(a==="chromaticities")return cn(e,n);if(a==="compression")return un(e,n);if(a==="box2i")return vn(e,n);if(a==="lineOrder")return fn(e,n);if(a==="float")return me(e,n);if(a==="v2f")return mn(e,n);if(a==="v3f")return hn(e,n);if(a==="int")return $e(e,n);if(a==="rational")return tn(e,n);if(a==="timecode")return an(e,n);if(a==="preview")return n.value+=i,"skipped";n.value+=i}function dn(e,r,n){const a={};if(e.getUint32(0,!0)!=20000630)throw"THREE.EXRLoader: provided file doesn't appear to be in OpenEXR format.";a.version=e.getUint8(4);const i=e.getUint8(5);a.spec={singleTile:!!(i&2),longName:!!(i&4),deepFormat:!!(i&8),multiPart:!!(i&16)},n.value=8;for(var s=!0;s;){var m=nr(r,n);if(m==0)s=!1;else{var f=nr(r,n),E=de(e,n),d=pn(e,r,n,f,E);d===void 0?console.warn(`EXRLoader.parse: skipped unknown header attribute type '${f}'.`):a[m]=d}}if((i&-5)!=0)throw console.error("EXRHeader:",a),"THREE.EXRLoader: provided file is currently unsupported.";return a}function gn(e,r,n,a,i){const s={size:0,viewer:r,array:n,offset:a,width:e.dataWindow.xMax-e.dataWindow.xMin+1,height:e.dataWindow.yMax-e.dataWindow.yMin+1,channels:e.channels.length,bytesPerLine:null,lines:null,inputSize:null,type:e.channels[0].pixelType,uncompress:null,getter:null,format:null,[Je?"colorSpace":"encoding"]:null};switch(e.compression){case"NO_COMPRESSION":s.lines=1,s.uncompress=br;break;case"RLE_COMPRESSION":s.lines=1,s.uncompress=Qr;break;case"ZIPS_COMPRESSION":s.lines=1,s.uncompress=sr;break;case"ZIP_COMPRESSION":s.lines=16,s.uncompress=sr;break;case"PIZ_COMPRESSION":s.lines=32,s.uncompress=en;break;case"PXR24_COMPRESSION":s.lines=16,s.uncompress=rn;break;case"DWAA_COMPRESSION":s.lines=32,s.uncompress=Rr;break;case"DWAB_COMPRESSION":s.lines=256,s.uncompress=Rr;break;default:throw"EXRLoader.parse: "+e.compression+" is unsupported"}if(s.scanlineBlockSize=s.lines,s.type==1)switch(i){case Le:s.getter=sn,s.inputSize=2;break;case xe:s.getter=Ye,s.inputSize=2;break}else if(s.type==2)switch(i){case Le:s.getter=me,s.inputSize=4;break;case xe:s.getter=on,s.inputSize=4}else throw"EXRLoader.parse: unsupported pixelType "+s.type+" for "+e.compression+".";s.blockCount=(e.dataWindow.yMax+1)/s.scanlineBlockSize;for(var m=0;m<s.blockCount;m++)Ee(r,a);s.outputChannels=s.channels==3?4:s.channels;const f=s.width*s.height*s.outputChannels;switch(i){case Le:s.byteArray=new Float32Array(f),s.channels<s.outputChannels&&s.byteArray.fill(1,0,f);break;case xe:s.byteArray=new Uint16Array(f),s.channels<s.outputChannels&&s.byteArray.fill(15360,0,f);break;default:console.error("THREE.EXRLoader: unsupported type: ",i);break}return s.bytesPerLine=s.width*s.inputSize*s.channels,s.outputChannels==4?s.format=Mn:s.format=xn,Je?s.colorSpace="srgb-linear":s.encoding=3e3,s}const tr=new DataView(o),En=new Uint8Array(o),Ke={value:0},qe=dn(tr,o,Ke),O=gn(qe,tr,En,Ke,this.type),Mr={value:0},wn={R:0,G:1,B:2,A:3,Y:0};for(let e=0;e<O.height/O.scanlineBlockSize;e++){const r=de(tr,Ke);O.size=de(tr,Ke),O.lines=r+O.scanlineBlockSize>O.height?O.height-r:O.scanlineBlockSize;const a=O.size<O.lines*O.bytesPerLine?O.uncompress(O):br(O);Ke.value+=O.size;for(let i=0;i<O.scanlineBlockSize;i++){const s=i+e*O.scanlineBlockSize;if(s>=O.height)break;for(let m=0;m<O.channels;m++){const f=wn[qe.channels[m].name];for(let E=0;E<O.width;E++){Mr.value=(i*(O.channels*O.width)+m*O.width+E)*O.inputSize;const d=(O.height-1-s)*(O.width*O.outputChannels)+E*O.outputChannels+f;O.byteArray[d]=O.getter(a,Mr)}}}}return{header:qe,width:O.width,height:O.height,data:O.byteArray,format:O.format,[Je?"colorSpace":"encoding"]:O[Je?"colorSpace":"encoding"],type:this.type}}setDataType(o){return this.type=o,this}load(o,l,u,c){function S(v,y){Je?v.colorSpace=y.colorSpace:v.encoding=y.encoding,v.minFilter=Ve,v.magFilter=Ve,v.generateMipmaps=!1,v.flipY=!1,l&&l(v,y)}return super.load(o,S,u,c)}}function lt(t,o,l,u){var c;return c=class extends Ur{constructor(S){super({vertexShader:o,fragmentShader:l,...S});for(const v in t)this.uniforms[v]=new Tn(t[v]),Object.defineProperty(this,v,{get(){return this.uniforms[v].value},set(y){this.uniforms[v].value=y}});this.uniforms=An.clone(this.uniforms)}},c.key=Un.generateUUID(),c}function xr(t,o,l){const u=Pe(k=>k.size),c=Pe(k=>k.viewport),S=typeof t=="number"?t:u.width*c.dpr,v=typeof o=="number"?o:u.height*c.dpr,y=(typeof t=="number"?l:t)||{},{samples:h=0,depth:_,...A}=y,T=_??y.depthBuffer,N=b.useMemo(()=>{const k=new Nn(S,v,{minFilter:Ve,magFilter:Ve,type:xe,...A});return T&&(k.depthTexture=new kn(S,v,Le)),k.samples=h,k},[]);return b.useLayoutEffect(()=>{N.setSize(S,v),h&&(N.samples=h)},[h,N,S,v]),b.useEffect(()=>()=>N.dispose(),[]),N}const ct=lt({},"void main() { }","void main() { gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0); discard;  }");class ut extends Dn{constructor(o=6,l=!1){super(),this.uniforms={chromaticAberration:{value:.05},transmission:{value:0},_transmission:{value:1},transmissionMap:{value:null},roughness:{value:0},thickness:{value:0},thicknessMap:{value:null},attenuationDistance:{value:1/0},attenuationColor:{value:new On("white")},anisotropicBlur:{value:.1},time:{value:0},distortion:{value:0},distortionScale:{value:.5},temporalDistortion:{value:0},buffer:{value:null}},this.onBeforeCompile=u=>{var c;u.uniforms={...u.uniforms,...this.uniforms},((c=this.anisotropy)!==null&&c!==void 0?c:0)>0&&(u.defines.USE_ANISOTROPY=""),l?u.defines.USE_SAMPLER="":u.defines.USE_TRANSMISSION="",u.fragmentShader=`
      uniform float chromaticAberration;         
      uniform float anisotropicBlur;      
      uniform float time;
      uniform float distortion;
      uniform float distortionScale;
      uniform float temporalDistortion;
      uniform sampler2D buffer;

      vec3 random3(vec3 c) {
        float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
        vec3 r;
        r.z = fract(512.0*j);
        j *= .125;
        r.x = fract(512.0*j);
        j *= .125;
        r.y = fract(512.0*j);
        return r-0.5;
      }

      uint hash( uint x ) {
        x += ( x << 10u );
        x ^= ( x >>  6u );
        x += ( x <<  3u );
        x ^= ( x >> 11u );
        x += ( x << 15u );
        return x;
      }

      // Compound versions of the hashing algorithm I whipped together.
      uint hash( uvec2 v ) { return hash( v.x ^ hash(v.y)                         ); }
      uint hash( uvec3 v ) { return hash( v.x ^ hash(v.y) ^ hash(v.z)             ); }
      uint hash( uvec4 v ) { return hash( v.x ^ hash(v.y) ^ hash(v.z) ^ hash(v.w) ); }

      // Construct a float with half-open range [0:1] using low 23 bits.
      // All zeroes yields 0.0, all ones yields the next smallest representable value below 1.0.
      float floatConstruct( uint m ) {
        const uint ieeeMantissa = 0x007FFFFFu; // binary32 mantissa bitmask
        const uint ieeeOne      = 0x3F800000u; // 1.0 in IEEE binary32
        m &= ieeeMantissa;                     // Keep only mantissa bits (fractional part)
        m |= ieeeOne;                          // Add fractional part to 1.0
        float  f = uintBitsToFloat( m );       // Range [1:2]
        return f - 1.0;                        // Range [0:1]
      }

      // Pseudo-random value in half-open range [0:1].
      float randomBase( float x ) { return floatConstruct(hash(floatBitsToUint(x))); }
      float randomBase( vec2  v ) { return floatConstruct(hash(floatBitsToUint(v))); }
      float randomBase( vec3  v ) { return floatConstruct(hash(floatBitsToUint(v))); }
      float randomBase( vec4  v ) { return floatConstruct(hash(floatBitsToUint(v))); }
      float rand(float seed) {
        float result = randomBase(vec3(gl_FragCoord.xy, seed));
        return result;
      }

      const float F3 =  0.3333333;
      const float G3 =  0.1666667;

      float snoise(vec3 p) {
        vec3 s = floor(p + dot(p, vec3(F3)));
        vec3 x = p - s + dot(s, vec3(G3));
        vec3 e = step(vec3(0.0), x - x.yzx);
        vec3 i1 = e*(1.0 - e.zxy);
        vec3 i2 = 1.0 - e.zxy*(1.0 - e);
        vec3 x1 = x - i1 + G3;
        vec3 x2 = x - i2 + 2.0*G3;
        vec3 x3 = x - 1.0 + 3.0*G3;
        vec4 w, d;
        w.x = dot(x, x);
        w.y = dot(x1, x1);
        w.z = dot(x2, x2);
        w.w = dot(x3, x3);
        w = max(0.6 - w, 0.0);
        d.x = dot(random3(s), x);
        d.y = dot(random3(s + i1), x1);
        d.z = dot(random3(s + i2), x2);
        d.w = dot(random3(s + 1.0), x3);
        w *= w;
        w *= w;
        d *= w;
        return dot(d, vec4(52.0));
      }

      float snoiseFractal(vec3 m) {
        return 0.5333333* snoise(m)
              +0.2666667* snoise(2.0*m)
              +0.1333333* snoise(4.0*m)
              +0.0666667* snoise(8.0*m);
      }
`+u.fragmentShader,u.fragmentShader=u.fragmentShader.replace("#include <transmission_pars_fragment>",`
        #ifdef USE_TRANSMISSION
          // Transmission code is based on glTF-Sampler-Viewer
          // https://github.com/KhronosGroup/glTF-Sample-Viewer
          uniform float _transmission;
          uniform float thickness;
          uniform float attenuationDistance;
          uniform vec3 attenuationColor;
          #ifdef USE_TRANSMISSIONMAP
            uniform sampler2D transmissionMap;
          #endif
          #ifdef USE_THICKNESSMAP
            uniform sampler2D thicknessMap;
          #endif
          uniform vec2 transmissionSamplerSize;
          uniform sampler2D transmissionSamplerMap;
          uniform mat4 modelMatrix;
          uniform mat4 projectionMatrix;
          varying vec3 vWorldPosition;
          vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in vec3 modelScale ) {
            // Direction of refracted light.
            // n is normalized once when the sample normal is built.
            vec3 refractionVector = refract( - v, n, 1.0 / ior );
            // The thickness is specified in local space.
            return normalize( refractionVector ) * thickness * modelScale;
          }
          float applyIorToRoughness( const in float roughness, const in float ior ) {
            // Scale roughness with IOR so that an IOR of 1.0 results in no microfacet refraction and
            // an IOR of 1.5 results in the default amount of microfacet refraction.
            return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
          }
          vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
            float framebufferLod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );            
            #ifdef USE_SAMPLER
              #ifdef texture2DLodEXT
                return texture2DLodEXT(transmissionSamplerMap, fragCoord.xy, framebufferLod);
              #else
                return texture2D(transmissionSamplerMap, fragCoord.xy, framebufferLod);
              #endif
            #else
              return texture2D(buffer, fragCoord.xy);
            #endif
          }
          vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
            const in vec3 position, const in vec3 modelScale, const in vec3 attenuationCoefficient, const in vec3 F,
            const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
            const in float attenuationDistance ) {
            vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelScale );
            vec3 refractedRayExit = position + transmissionRay;
            // Project refracted vector on the framebuffer, while mapping to normalized device coordinates.
            vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
            vec2 refractionCoords = ndcPos.xy / ndcPos.w;
            refractionCoords += 1.0;
            refractionCoords /= 2.0;
            // Sample framebuffer to get pixel the refracted ray hits.
            vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
            vec3 attenuatedColor = transmittedLight.rgb;
            if ( !isinf( attenuationDistance ) ) {
              // Apply Beer's law.
              attenuatedColor *= exp( - attenuationCoefficient * length( transmissionRay ) );
            }
            return vec4( ( 1.0 - F ) * attenuatedColor * diffuseColor, transmittedLight.a );
          }
        #endif
`),u.fragmentShader=u.fragmentShader.replace("#include <transmission_fragment>",`  
        // Improve the refraction to use the world pos
        material.transmission = _transmission;
        material.transmissionAlpha = 1.0;
        material.thickness = thickness;
        material.attenuationDistance = attenuationDistance;
        material.attenuationColor = attenuationColor;
        #ifdef USE_TRANSMISSIONMAP
          material.transmission *= texture2D( transmissionMap, vUv ).r;
        #endif
        #ifdef USE_THICKNESSMAP
          material.thickness *= texture2D( thicknessMap, vUv ).g;
        #endif
        
        if (material.transmission != 0.0) {
          vec3 pos = vWorldPosition;
          float runningSeed = 0.0;
          vec3 v = normalize( cameraPosition - pos );
          vec3 n = inverseTransformDirection( normal, viewMatrix );
          vec3 transmission = vec3(0.0);
          float randomCoords = rand(runningSeed++);
          float thickness_smear = thickness * max(pow(roughnessFactor, 0.33), anisotropicBlur);
          vec3 distortionNormal = vec3(0.0);
          vec3 temporalOffset = vec3(time, -time, -time) * temporalDistortion;

          vec3 modelScale = vec3(
            length( vec3( modelMatrix[ 0 ].xyz ) ),
            length( vec3( modelMatrix[ 1 ].xyz ) ),
            length( vec3( modelMatrix[ 2 ].xyz ) )
          );

          // Beer's-law coefficient
          vec3 attenuationCoefficient = vec3(0.0);
          if ( !isinf( material.attenuationDistance ) ) {
            attenuationCoefficient = -log( material.attenuationColor ) / material.attenuationDistance;
          }

          if (distortion > 0.0) {
            distortionNormal = distortion * vec3(snoiseFractal(vec3((pos * distortionScale + temporalOffset))), snoiseFractal(vec3(pos.zxy * distortionScale - temporalOffset)), snoiseFractal(vec3(pos.yxz * distortionScale + temporalOffset)));
          }
          for (float i = 0.0; i < ${o}.0; i ++) {
            vec3 sampleNorm;
            if (roughnessFactor > 0.0) {
              sampleNorm = normalize(n + roughnessFactor * roughnessFactor * 2.0 * normalize(vec3(rand(runningSeed++) - 0.5, rand(runningSeed++) - 0.5, rand(runningSeed++) - 0.5)) * pow(rand(runningSeed++), 0.33) + distortionNormal);
            } else {
              // Smooth surfaces skip four hashes, a pow, and a normalization per sample
              sampleNorm = normalize(n + distortionNormal);
            }
            float sampleProgress = (i + randomCoords) / float(${o});
            float sampleThickness = material.thickness + thickness_smear * sampleProgress;
            // Fresnel is identical for RGB; only the refracted IOR changes.
            vec3 F = EnvironmentBRDF( sampleNorm, v, material.specularColor, material.specularF90, material.roughness );
            if (chromaticAberration == 0.0) {
              // With one IOR, a single framebuffer sample supplies all RGB channels
              transmission += getIBLVolumeRefraction(
                sampleNorm, v, material.roughness, material.diffuseColor, pos, modelScale, attenuationCoefficient, F,
                viewMatrix, projectionMatrix, material.ior, sampleThickness, material.attenuationDistance
              ).rgb;
            } else {
              float aberration = chromaticAberration * sampleProgress;
              transmission.r += getIBLVolumeRefraction(
                sampleNorm, v, material.roughness, material.diffuseColor, pos, modelScale, attenuationCoefficient, F,
                viewMatrix, projectionMatrix, material.ior, sampleThickness, material.attenuationDistance
              ).r;
              transmission.g += getIBLVolumeRefraction(
                sampleNorm, v, material.roughness, material.diffuseColor, pos, modelScale, attenuationCoefficient, F,
                viewMatrix, projectionMatrix, material.ior * (1.0 + aberration), sampleThickness, material.attenuationDistance
              ).g;
              transmission.b += getIBLVolumeRefraction(
                sampleNorm, v, material.roughness, material.diffuseColor, pos, modelScale, attenuationCoefficient, F,
                viewMatrix, projectionMatrix, material.ior * (1.0 + 2.0 * aberration), sampleThickness, material.attenuationDistance
              ).b;
            }
          }
          transmission /= ${o}.0;
          totalDiffuse = mix( totalDiffuse, transmission, material.transmission );
        }
`)},Object.keys(this.uniforms).forEach(u=>Object.defineProperty(this,u,{get:()=>this.uniforms[u].value,set:c=>this.uniforms[u].value=c}))}}const bt=b.forwardRef(({buffer:t,transmissionSampler:o=!1,backside:l=!1,side:u=Fn,transmission:c=1,thickness:S=0,backsideThickness:v=0,backsideEnvMapIntensity:y=1,samples:h=10,resolution:_,backsideResolution:A,background:T,anisotropy:N,anisotropicBlur:k,...fe},ee)=>{Tr({MeshTransmissionMaterial:ut});const P=b.useRef(null),[H]=b.useState(()=>new ct),$=A??_,le=xr($,$),ie=xr(_,_);let oe,q,se,g;return Ar(C=>{const x=P.current;if(x.uniforms.time.value=C.clock.elapsedTime,x.uniforms.buffer.value===ie.texture&&!o){var z;g=(z=x.__r3f)==null||(z=z.parent)==null?void 0:z.object,g&&x.visible&&x.uniforms._transmission.value!==0&&(se=C.gl.toneMapping,oe=C.scene.background,q=x.envMapIntensity,C.gl.toneMapping=Bn,T&&(C.scene.background=T),g.material=H,l&&(C.gl.setRenderTarget(le),C.gl.render(C.scene,C.camera),g.material=x,x.uniforms.buffer.value=le.texture,x.uniforms.thickness.value=v,x.side=lr,u!==lr&&(x.needsUpdate=!0),x.envMapIntensity=y),C.gl.setRenderTarget(ie),C.gl.render(C.scene,C.camera),g.material=x,x.uniforms.thickness.value=S,x.side=u,l&&u!==lr&&(x.needsUpdate=!0),x.uniforms.buffer.value=ie.texture,x.envMapIntensity=q,C.scene.background=oe,C.gl.setRenderTarget(null),C.gl.toneMapping=se)}}),b.useImperativeHandle(ee,()=>P.current,[]),b.createElement("meshTransmissionMaterial",We({args:[h,o],ref:P},fe,{buffer:t||ie.texture,_transmission:c,anisotropicBlur:k??N,transmission:o?c:0,thickness:S,side:u}))}),Me=1e-5;function vt(t,o,l){const u=new zn,c=l-Me;return u.absarc(Me,Me,Me,-Math.PI/2,-Math.PI,!0),u.absarc(Me,o-c*2,Me,Math.PI,Math.PI/2,!0),u.absarc(t-c*2,o-c*2,Me,Math.PI/2,0,!0),u.absarc(t-c*2,Me,Me,0,-Math.PI/2,!0),u}const Rt=b.forwardRef(function({args:[o=1,l=1,u=1]=[],radius:c=.05,steps:S=1,smoothness:v=4,bevelSegments:y=4,creaseAngle:h=.4,children:_,...A},T){return b.createElement("mesh",We({ref:T},A),b.createElement(ft,{args:[o,l,u],radius:c,steps:S,smoothness:v,bevelSegments:y,creaseAngle:h}),_)}),ft=b.forwardRef(function({args:[o=1,l=1,u=1]=[],radius:c=.05,steps:S=1,smoothness:v=4,bevelSegments:y=4,creaseAngle:h=.4,..._},A){const T=b.useMemo(()=>vt(o,l,c),[o,l,c]),N=b.useMemo(()=>({depth:u-c*2,bevelEnabled:!0,bevelSegments:y*2,steps:S,bevelSize:c-Me,bevelThickness:c,curveSegments:v}),[u,c,v,y,S]),k=b.useRef(null);return b.useLayoutEffect(()=>{k.current&&(k.current.center(),Wn(k.current,h))},[T,N,h]),b.useImperativeHandle(A,()=>k.current),b.createElement("extrudeGeometry",We({ref:k,args:[T,N]},_))}),er={apartment:"lebombo_1k.hdr",city:"potsdamer_platz_1k.hdr",dawn:"kiara_1_dawn_1k.hdr",forest:"forest_slope_1k.hdr",lobby:"st_fagans_interior_1k.hdr",night:"dikhololo_night_1k.hdr",park:"rooitou_park_1k.hdr",studio:"studio_small_03_1k.hdr",sunset:"venice_sunset_1k.hdr",warehouse:"empty_warehouse_01_1k.hdr"},Zr="https://raw.githack.com/pmndrs/drei-assets/456060a26bbeb8fdf79326f224b6d99b8bcce736/hdri/",He=t=>Array.isArray(t),hr=["/px.png","/nx.png","/py.png","/ny.png","/pz.png","/nz.png"];function ir({files:t=hr,path:o="",preset:l=void 0,colorSpace:u=void 0,extensions:c}={}){l&&(pr(l),t=er[l],o=Zr);const S=He(t),{extension:v,isCubemap:y}=dr(t),h=gr(v);if(!h)throw new Error("useEnvironment: Unrecognized file extension: "+t);const _=Pe(k=>k.gl);b.useLayoutEffect(()=>{if(v!=="webp"&&v!=="jpg"&&v!=="jpeg")return;function k(){or.clear(h,S?[t]:t)}_.domElement.addEventListener("webglcontextlost",k,{once:!0})},[t,_.domElement]);const A=or(h,S?[t]:t,k=>{(v==="webp"||v==="jpg"||v==="jpeg")&&k.setRenderer(_),k.setPath==null||k.setPath(o),c&&c(k)});let T=S?A[0]:A;if(v==="jpg"||v==="jpeg"||v==="webp"){var N;T=(N=T.renderTarget)==null?void 0:N.texture}return T.mapping=y?Ln:Pn,T.colorSpace=u??(y?"srgb":"srgb-linear"),T}const mt={files:hr,path:"",preset:void 0,extensions:void 0};ir.preload=t=>{const o={...mt,...t};let{files:l,path:u=""}=o;const{preset:c,extensions:S}=o;c&&(pr(c),l=er[c],u=Zr);const{extension:v}=dr(l);if(v==="webp"||v==="jpg"||v==="jpeg")throw new Error("useEnvironment: Preloading gainmaps is not supported");const y=gr(v);if(!y)throw new Error("useEnvironment: Unrecognized file extension: "+l);or.preload(y,He(l)?[l]:l,h=>{h.setPath==null||h.setPath(u),S&&S(h)})};const ht={files:hr,preset:void 0};ir.clear=t=>{const o={...ht,...t};let{files:l}=o;const{preset:u}=o;u&&(pr(u),l=er[u]);const{extension:c}=dr(l),S=gr(c);if(!S)throw new Error("useEnvironment: Unrecognized file extension: "+l);or.clear(S,He(l)?[l]:l)};function pr(t){if(!(t in er))throw new Error("Preset must be one of: "+Object.keys(er).join(", "))}function dr(t){var o;const l=He(t)&&t.length===6,u=He(t)&&t.length===3&&t.some(v=>v.endsWith("json")),c=He(t)?t[0]:t;return{extension:l?"cube":u?"webp":c.startsWith("data:application/exr")?"exr":c.startsWith("data:application/hdr")?"hdr":c.startsWith("data:image/jpeg")?"jpg":(o=c.split(".").pop())==null||(o=o.split("?"))==null||(o=o.shift())==null?void 0:o.toLowerCase(),isCubemap:l,isGainmap:u}}function gr(t){return t==="cube"?Zn:t==="hdr"?it:t==="exr"?st:t==="jpg"||t==="jpeg"?_n:t==="webp"?In:null}const pt=t=>t.current&&t.current.isScene,dt=t=>pt(t)?t.current:t;function Er(t,o,l,u,c={}){var S,v,y,h;c={backgroundBlurriness:0,backgroundIntensity:1,backgroundRotation:[0,0,0],environmentIntensity:1,environmentRotation:[0,0,0],...c};const _=dt(o||l),A=_.background,T=_.environment,N={backgroundBlurriness:_.backgroundBlurriness,backgroundIntensity:_.backgroundIntensity,backgroundRotation:(S=(v=_.backgroundRotation)==null||v.clone==null?void 0:v.clone())!==null&&S!==void 0?S:[0,0,0],environmentIntensity:_.environmentIntensity,environmentRotation:(y=(h=_.environmentRotation)==null||h.clone==null?void 0:h.clone())!==null&&y!==void 0?y:[0,0,0]};return t!=="only"&&(_.environment=u),t&&(_.background=u),vr(_,c),()=>{t!=="only"&&(_.environment=T),t&&(_.background=A),vr(_,N)}}function wr({scene:t,background:o=!1,map:l,...u}){const c=Pe(S=>S.scene);return b.useLayoutEffect(()=>{if(l)return Er(o,t,c,l,u)}),null}function Gr({background:t=!1,scene:o,blur:l,backgroundBlurriness:u,backgroundIntensity:c,backgroundRotation:S,environmentIntensity:v,environmentRotation:y,...h}){const _=ir(h),A=Pe(T=>T.scene);return b.useLayoutEffect(()=>Er(t,o,A,_,{backgroundBlurriness:l??u,backgroundIntensity:c,backgroundRotation:S,environmentIntensity:v,environmentRotation:y})),b.useEffect(()=>()=>{_.dispose()},[_]),null}function gt({children:t,near:o=.1,far:l=1e3,resolution:u=256,frames:c=1,map:S,background:v=!1,blur:y,backgroundBlurriness:h,backgroundIntensity:_,backgroundRotation:A,environmentIntensity:T,environmentRotation:N,scene:k,files:fe,path:ee,preset:P=void 0,extensions:H}){const $=Pe(g=>g.gl),le=Pe(g=>g.scene),ie=b.useRef(null),[oe]=b.useState(()=>new Gn),q=b.useMemo(()=>{const g=new Hn(u);return g.texture.type=xe,g},[u]);b.useEffect(()=>()=>{q.dispose()},[q]),b.useLayoutEffect(()=>{if(c===1){const g=$.autoClear;$.autoClear=!0,ie.current.update($,oe),$.autoClear=g}return Er(v,k,le,q.texture,{backgroundBlurriness:y??h,backgroundIntensity:_,backgroundRotation:A,environmentIntensity:T,environmentRotation:N})},[t,oe,q.texture,k,le,v,c,$]);let se=1;return Ar(()=>{if(c===1/0||se<c){const g=$.autoClear;$.autoClear=!0,ie.current.update($,oe),$.autoClear=g,se++}}),b.createElement(b.Fragment,null,Sn(b.createElement(b.Fragment,null,t,b.createElement("cubeCamera",{ref:ie,args:[o,l,q]}),fe||P?b.createElement(Gr,{background:!0,files:fe,preset:P,path:ee,extensions:H}):S?b.createElement(wr,{background:!0,map:S,extensions:H}):null),oe))}function Et(t){var o,l,u,c;const S=ir(t),v=t.map||S;b.useMemo(()=>Tr({GroundProjectedEnvImpl:ot}),[]),b.useEffect(()=>()=>{S.dispose()},[S]);const y=b.useMemo(()=>[v],[v]),h=(o=t.ground)==null?void 0:o.height,_=(l=t.ground)==null?void 0:l.radius,A=(u=(c=t.ground)==null?void 0:c.scale)!==null&&u!==void 0?u:1e3;return b.createElement(b.Fragment,null,b.createElement(wr,We({},t,{map:v})),b.createElement("groundProjectedEnvImpl",{args:y,scale:A,height:h,radius:_}))}function Ct(t){return t.ground?b.createElement(Et,t):t.map?b.createElement(wr,t):t.children?b.createElement(gt,t):b.createElement(Gr,t)}const Mt=b.forwardRef(({light:t,args:o,map:l,toneMapped:u=!1,color:c="white",form:S="rect",intensity:v=1,scale:y=1,target:h=[0,0,0],children:_,...A},T)=>{const N=b.useRef(null);return b.useImperativeHandle(T,()=>N.current,[]),b.useLayoutEffect(()=>{!_&&!A.material&&(vr(N.current.material,{color:c}),N.current.material.color.multiplyScalar(v))},[c,v,_,A.material]),b.useLayoutEffect(()=>{A.rotation||N.current.quaternion.identity(),h&&!A.rotation&&(typeof h=="boolean"?N.current.lookAt(0,0,0):N.current.lookAt(Array.isArray(h)?new Ne(...h):h))},[h,A.rotation]),y=Array.isArray(y)&&y.length===2?[y[0],y[1],1]:y,b.createElement("mesh",We({ref:N,scale:y},A),S==="circle"?b.createElement("ringGeometry",{args:o||[0,.5,64]}):S==="ring"?b.createElement("ringGeometry",{args:o||[.25,.5,64]}):S==="rect"||S==="plane"?b.createElement("planeGeometry",{args:o||[1,1]}):S==="box"?b.createElement("boxGeometry",{args:o||[1,1,1]}):b.createElement(S,{args:o}),_||b.createElement("meshBasicMaterial",{toneMapped:u,map:l,side:Nr}),t&&b.createElement("pointLight",We({castShadow:!0},t)))});export{Ct as E,Mt as L,bt as M,Rt as R};
//# sourceMappingURL=three-tools-CUktn3zK.js.map
