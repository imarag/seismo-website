import tectonicPlates from '../../img/tectonic-plates.png';
import faultAnimation from '../../img/fault-animation.gif';
import pWaves from '../../img/p-waves.gif';
import shWaves from '../../img/sh-waves.gif';
import svWaves from '../../img/sv-waves.gif';
import loveWaves from '../../img/love-waves.gif';
import rayleighWaves from '../../img/rayleigh-waves.gif';
import sourceMediumStation from '../../img/source-medium-station.png';
import seismicPhases from '../../img/seismic-phases.png';
import faultTypeGeneral from '../../img/fault-type-general.png';
import faultGeometry from '../../img/fault-geometry.png';
import normalSlipFault from '../../img/normal-slip-fault.gif';
import reverseSlipFault from '../../img/reverse-slip-fault.gif';
import strikeSlipFault from '../../img/strike-slip-fault.gif';

export default function SeismologyIntro() {
  return (
    <div>
      <h1>What is an Earthquake?</h1>
      <p>An earthquake is a natural phenomenon...</p>
      <div>
        <figure>
          <img src={tectonicPlates} alt="Tectonic Plates" />
          <figcaption>Most earthquakes are concentrated at the edges of the tectonic plates that constitute the lithosphere of the Earth</figcaption>
        </figure>
      </div>
      <div>
        <figure>
          <img src={faultAnimation} alt="Fault Animation" />
          <figcaption>Generation of an earthquake by a sudden release of energy of an active seismic fault</figcaption>
        </figure>
      </div>
      <div>
        <figure>
          <img src={pWaves} alt="P Waves" />
          <figcaption>Propagation of P waves</figcaption>
        </figure>
      </div>
      <div>
        <figure>
          <img src={shWaves} alt="SH Waves" />
          <figcaption>Propagation of SH waves</figcaption>
        </figure>
      </div>
      <div>
        <figure>
          <img src={svWaves} alt="SV Waves" />
          <figcaption>Propagation of SV waves</figcaption>
        </figure>
      </div>
      <div>
        <figure>
          <img src={loveWaves} alt="Love Waves" />
          <figcaption>Propagation of Love Waves</figcaption>
        </figure>
      </div>
      <div>
        <figure>
          <img src={rayleighWaves} alt="Rayleigh Waves" />
          <figcaption>Propagation of Rayleigh Waves</figcaption>
        </figure>
      </div>
      <div>
        <figure>
          <img src={sourceMediumStation} alt="Source Medium Station" />
          <figcaption>Seismic waves are generated at a source or focus, travel through the earth medium and are recorded at a receiver or seismometer at the surface.</figcaption>
        </figure>
      </div>
      <div>
        <figure>
          <img src={seismicPhases} alt="Seismic Phases" />
          <figcaption>Various seismic phases generated from the interactions of the body waves and the earth's interior layers</figcaption>
        </figure>
      </div>
      <div>
        <figure>
          <img src={faultTypeGeneral} alt="Fault Type General" />
          <figcaption>A fault is assumed to be a planar surface. The block located above the fault plane is called the hanging wall and the block below, the footwall</figcaption>
        </figure>
      </div>
      <div>
        <figure>
          <img src={faultGeometry} alt="Fault Geometry" />
          <figcaption>The geometry of a seismic fault</figcaption>
        </figure>
      </div>
      <div>
        <figure>
          <img src={normalSlipFault} alt="Normal Slip Fault" />
          <figcaption>Normal slip faulting. The hanging wall moves downwards relative to the foot wall in which the slip angle is 270 degrees</figcaption>
        </figure>
      </div>
      <div>
        <figure>
          <img src={reverseSlipFault} alt="Reverse Slip Fault" />
          <figcaption>Reverse slip faulting. The hanging wall moves upwards relative to the foot wall in which the slip angle is 90 degrees</figcaption>
        </figure>
      </div>
      <div>
        <figure>
          <img src={strikeSlipFault} alt="Strike Slip Fault" />
          <figcaption>Left-lateral strike-slip fault. This movement results in a 0-degree slip angle, as the relative motion is in the opposite direction when compared to the reference point on the other side of the fault</figcaption>
        </figure>
      </div>
    </div>
  );
}
