import tectonicPlates from '@/images/tectonic-plates.png';
import faultAnimation from '@/images/fault-animation.gif';
import pWaves from '@/images/p-waves.gif';
import shWaves from '@/images/sh-waves.gif';
import svWaves from '@/images/sv-waves.gif';
import loveWaves from '@/images/love-waves.gif';
import rayleighWaves from '@/images/rayleigh-waves.gif';
import sourceMediumStation from '@/images/source-medium-station.png';
import seismicPhases from '@/images/seismic-phases.png';
import faultTypeGeneral from '@/images/fault-type-general.png';
import faultGeometry from '@/images/fault-geometry.png';
import normalSlipFault from '@/images/normal-slip-fault.gif';
import reverseSlipFault from '@/images/reverse-slip-fault.gif';
import strikeSlipFault from '@/images/strike-slip-fault.gif';

export default function SeismologyIntro() {
  return (
    <>
      <h1>What is an Earthquake?</h1>
      <p>
          An earthquake is a natural phenomenon that occurs when there is a <i>sudden release of energy</i> in the Earth's
          crust, resulting in seismic
          waves that cause the ground to shake. This shaking can range from minor tremors that are barely noticeable to
          violent movements that can cause
          widespread destructions. Earthquakes can be generated in various ways such as along the edges of the tectonic plates
          that constitute the earth,
          along seismic faults far from the edges of the tectonic plates (intraplate earthquakes), volcanic activity, human
          activity (induced seismicity) etc.
      </p>
      <p>
          Tectonic plates are part of the lithosphere of the Earth. They are in constant motion between one another due to the
          heat-driven convection currents in
          the Earth's mantle. When the edges of these plates interact, they can grind against each other, pull apart, or
          collide. The stress and pressure that
          build up at these plate boundaries can be released suddenly and create an earthquake. The largest earthquakes
          typically occur at plate boundaries.
      </p>
      <figure>
          <img src={tectonicPlates} />
          <figcaption>Most earthquakes are concentrated at the edges of the tectonic plates that consitute the lithosphere
              of the Earth</figcaption>
      </figure>
      <p>
          Earthquakes can also originate from the sudden movement along active faults within a single tectonic plate. Active
          faults are fractures in the Earth's
          crust that have experienced recent movement, and they can accumulate stress over time. When the stress along these
          faults becomes too great, the rocks can
          slip suddenly, generating seismic waves and causing an earthquake.
      </p>
      <figure>
          <img src={faultAnimation} />
          <figcaption>Generation of an earthquake by a sudden release of enery of an active seismic fault</figcaption>
      </figure>
      <p>
          Earthquakes can have a wide range of effects, including ground shaking, surface rupture, landslides,
          tsunamis (if the earthquake occurs under the ocean), and damage to buildings and infrastructure. The severity of an
          earthquake's impact depends
          on its magnitude (energy released), its distance from the epicenter, and local geological conditions.
      </p>
      <h1>Seismic Waves</h1>
      <p>
          The released energy travels through the earth material in the form of seismic waves. These waves carry valuable
          information about the
          Earth's interior structure and composition. Seismic waves can be mainly categorized into two types of waves: <i>body
              waves</i> and
          <i>surface waves</i>.
      </p>
      <h2>Body Waves</h2>
      <p>
          <i>Body waves</i> are a type of seismic waves that travel through the Earth's interior layers. There are two main
          types of body
          waves: <i>P-waves</i> (primary or compressional waves) and <i>S-waves</i>
          (secondary or shear waves).
      </p>
      <p>
          Compressional or P waves are the fastest seismic waves and are the first to be detected at a seismic
          station after an earthquake event. They travel through solid and liquid materials. It's wave motion causes the
          particles in the rock to move
          in the same direction as the one that the wave is propagating. This movement is in the form of compression and
          expansion like a spring.
      </p>
        <figure>
            <img src={pWaves} />
            <figcaption>Propagation of P waves </figcaption>
        </figure>
      <p>
          On the other hand, shear waves are another type of body waves which are slower that the P waves, and they arrive at
          a later time at the seismic station. They can only pass through solid
          materials, due to its wave motion that cause particles in the rock to move perpendicular to the direction of wave
          propagation. This
          movement is in a side-to-side or up-and-down motion, resembling the movement of a rope. S-waves are responsible
          for the most severe shaking and structural damage after an earthuake. Due to its motion the S waves can be further
          classified to <i>SH</i> or
          <i>horizontal shear</i> and <i>SV</i> or <i>vertical shear</i> waves. The SH waves have a horizontal shearing
          motion, causing particles to
          move side-to-side in a horizontal direction. This side-to-side motion is similar to the movement of a snake. The SV
          waves have a vertical shearing motion, causing particles to move up and down in a vertical direction.
      </p>
      <figure>
          <img src={shWaves} />
          <figcaption>Propagation of SH waves</figcaption>
      </figure>
  
      <figure>
          <img src={svWaves} />
          <figcaption>Propagation of SV waves</figcaption>
      </figure>
      <h2>Surface Waves</h2>
      <p>
          <i>Surface waves</i> are another type of seismic waves that travel along the Earth's surface rather than propagating
          through
          its interior. These waves are produced by the complex interactions of compressional (P) and shear (S) waves with the
          Earth's surface. Surface waves have a distinct motion that is similar to the movement of ocean
          waves. They move slower than P-waves and S-waves but can have larger amplitudes, making them particularly impactful
          during
          earthquakes. Surface waves are responsible for much of the ground shaking and damage experienced in seismic events.
          There are
          two main types of surface waves: <i>Love waves</i>, which have a side-to-side motion resembling a snake's slither,
          and
          <i>Rayleigh waves</i>, which produce an elliptical, rolling motion.
      </p>
      <figure>
          <img src={loveWaves} />
          <figcaption>Propagation of Love Waves</figcaption>
      </figure>
      <figure>
          <img src={rayleighWaves} />
          <figcaption>Propagation of Rayleigh Waves</figcaption>
      </figure>
      <h1>Earthquake concepts</h1>
      <p>
          Seismic waves are generated at a source called <i>focus</i> or <i>hypocenter</i>, which can be natural, such as an
          earthquake or artificial, such as an explosion.
          The generated waves travel through the earth medium and are recorded at a <i>receiver</i>. The receiver is known as
          the <i>seismometer</i>
          and the record of the ground motion at the seismometer is called the <i>seismogram</i>. A seismogram, contains
          information
          about both the source and the medium. The earth <i>medium</i>, or subsurface, refers to the material through which
          seismic waves travel,
          which can include rock layers, soil, and fluids.
      </p>
      <p>
          If the origin time when the waves left the source is known, their arrival time at the receiver gives the <i>travel
              time</i> required
          to pass through the medium. This time gives information about the speed at which they traveled and generally about
          the physical
          properties of the medium. In addition because the amplitude of the waves are affected by the medium, the signals
          observed on
          seismograms provide additional information about the portion of the earth that the waves traveled through.
      </p>
      <figure>
          <img src={sourceMediumStation} />
          <figcaption>Seismic waves are generated at a source or focus, travel through the earth medium and are recorded
              at a receiver or seismometer at the surface.</figcaption>
      </figure>
      <p>
          The seismic waves can be highly affected by the <i>underground geology</i>, a phenomenon known as <i>site
              effect</i>. The underground structure can greatly amplify or
          deamplify the amplitude of the incoming ground motion as well as change its frequency content.
      </p>
      <p>
          The distance between the source and the station that recorded the earthquake is known as <i>Hypocentral
              Distance</i>. It provides
          information about the direct path that seismic waves take to reach an observation point. On the other hand,
          <i>Epicentral Distance</i> is the distance from the <i>epicenter</i>, which is the point directly above the
          hypocenter on the
          Earth's surface, to the station. These distances are essential in assessing the intensity and impact of seismic
          events, aiding in
          understanding their effects on structures and communities.
      </p>
      <h1>Seismic phases</h1>
      <p>
          In addition to the direct P and S waves, there are other related waves that arise from the interactions of the
          seismic
          waves with the various layers and boundaries within the Earth. These phases play a crucial role in unraveling the
          Earth's
          intricate internal structure. For instance, there is a phase of the compressional (P) wave that can occur after it
          reflects the surface and then is recorded at the receiver (PP). Another, happens when then P wave reflects the outer
          core and then
          end up at the receiver (PcP) or when the P wave travels through the mantle, the outer and the inner core and then
          ends up at the
          surface (PKIKP). Similar seismic phases can be generated from the direct shear (S) waves and its interactions with
          the underground layers.
      </p>
      <figure>
          <img src={seismicPhases} />
          <figcaption>Various seismic phases generated from the interactions of the body waves and the earth's interior
              layers</figcaption>
      </figure>
      <p>
          Seismologists use these seismic phases to uncover the secrets of Earth's deep layers. By studying when and how these
          phases arrive,
          scientists explore the mysteries of our planet's hidden geology, enhancing our understanding of Earth's complexity
          and dynamics.
      </p>
      <h1>Seismic Faults</h1>
      <p>
          Earthquakes almost always happen along faults, where one part of the Earth's surface shifts relative to the other.
          These faults are often
          recognized through geological mapping, revealing historical fault movements. As per the elastic rebound theory,
          stress builds up on opposite
          sides of the fault, effectively locking it. When the accumulated strain overcomes the fault's strength, it suddenly
          releases, causing the
          fault to slip and triggering an earthquake. The upper or overlying block along the fault plane (assuming that a
          fault is a planar surface) is called the
          <i>hanging wall</i> and the block that lies underneath is called the <i>footwall</i>.
      </p>
      <figure>
          <img src={faultTypeGeneral} />
          <figcaption>A fault is assumed to be a planar surface. The block located
              above the fault plane is called the hanging wall and the block below, the footwall</figcaption>
      </figure>
      <p>
          To describe the geometry of a fault, we need to assume that a fault is a planar surface across which relative motion
          accurs
          during an earthquake. The coordinate axis used to describe the fault are the <code>X1</code> axis that is called the
          <i>strike</i> of the fault (the instersection of the fault plane with the surface), the <code>X2</code> axis that is
          perpedicular to the <code>X1</code> axis and <code>X3</code> axis that it points upward and is
          perpendicular to the other two.
      </p>
      <figure>
          <img src={faultGeometry} />
          <figcaption>The geometry of a seismic fault</figcaption>
      </figure>
      <p>
          The fault geometry can be completely described using two different coordinate systems:
          a) <code>n</code>, <code>d</code> and b) <code>φ</code>, <code>δ</code>, <code>λ</code>. The first coordinate system
          uses the <i>normal</i> vector on the
          fault plane (<code>n</code>) and the perpendicular to the normal vector, the <i>slip</i> vector, <code>d</code> that
          shows the direction of motion, that is the direction in which the
          upper side of the fault (hanging wall) moved with respect to the lower side (foot wall). The second system, consists
          of the <i>dip angle</i> <code>δ</code>, that gives the orientation of
          the fault plane with respect to the surface, the counterclockwise measured <i>slip angle</i> <code>λ</code> measured
          from the
          <code>X1</code> axis, that gives the direction of motion or the motion of the hanging wall block with respect to the
          foot wall block and lastly the <i>fault strike</i> <code>φ</code> that is the angle measured
          clockwise from the North to the <code>X1</code> axis.
      </p>
      <p>
          Due to different values of the slip angle (0-360 degrees) we can classify the faults into three categories:
          a) normal faulting, b) reverse or thrust faulting, c) strike-slip faulting. However, most earthquakes consists of
          some combination of these motions and have slip angles between these values.
      </p>
      <h2>Normal-slip faulting</h2>
      <p>
          This describes a <i>dip-slip</i> motion. In this position, the hanging wall moves downwards relative
          to the foot wall, indicating normal fault activity. In this case, the slip angle is 270 degrees.
      </p>
      <figure>
          <img src={normalSlipFault} />
          <figcaption>Normal slip faulting. The hanging wall moves downwards relative
              to the foot wall in which the slip angle is 270 degrees</figcaption>
      </figure>
      <h2>Reverse-slip faulting</h2>
      <p>
          This also describes a <i>dip-slip</i> motion. In this position, the hanging wall moves upwards relative
          to the foot wall, indicating reverse fault activity. The slip angle is 90 degrees.
      </p>
      <figure>
          <img src={reverseSlipFault} />
          <figcaption>Reverse slip faulting. The hanging wall moves upwards relative
              to the foot wall in which the slip angle is 90 degrees</figcaption>
      </figure>
      <h2>Strike-slip faulting</h2>
      <p>
          When the two sides of the fault slide horizontally by each other, a pure strike-slip occurs. Depending
          on the direction of movement when viewed from one side of the fault, the slip can be described as left-lateral or
          right-lateral. When the slip angle is zero, the hanging wall moves to the right and the motion is
          <i>left-lateral</i>.
          Similarly, for slip angle at 180 degrees, a <i>right-lateral</i> motion occurs.
      </p>
      <figure>
          <img src={strikeSlipFault} />
          <figcaption>Left-lateral strike-slip fault.
              This movement results in a 0-degree slip angle, as the relative motion is in the opposite direction when
              compared to the reference point on the other side of the fault</figcaption>
      </figure>
      <h1>Seismic Hazards</h1>
      <p>
          One of the most significant seismic hazards is the <i>shaking of the ground</i>. When an earthquake happens, waves
          spread out
          from the source and move quickly through the Earth's outer layer. When these
          waves reach the surface, they cause the ground to shake, which can last a few seconds or even minutes. Most of the
          problems
          caused by earthquakes come from this shaking. If there's not much shaking, the other issues related to earthquakes
          might not
          be a big concern. But when the shaking is powerful, it can lead to various problems like landslides or collapsing
          buildings.
      </p>
      <p>
          Undoubtedly, the most striking and unforgettable depictions of earthquake devastation are the <i>structural
              hazards</i>.
          From the anticipated collapse of poorly fortified masonry and adobe buildings, where numerous individuals in less
          developed
          regions reside, to the unexpected ruination of more contemporary constructions, structural impairment remains a
          primary factor
          contributing to both loss of life and financial setbacks in numerous seismic events.
      </p>
      <p>
          Some of the most remarkable instances of earthquake-related destruction have taken place when soil deposits lose
          their
          solidity and seem to transform into fluid-like substances. This occurrence, known as <i>liquefaction</i>, entails a
          significant reduction in the soil's strength, often to the extent that it's incapable of providing support to
          structures or
          retaining stability. Liquefaction is primarily observed in saturated soils, making it most prevalent in close
          proximity to
          rivers, bays, and other water bodies.
      </p>
      <p>
          Powerful earthquakes frequently trigger <i>landslides</i>. While most of these landslides are minor in scale,
          seismic events
          have also led to substantial slides. Regrettably, in certain instances, landslides triggered by earthquakes have
          completely
          covered towns and villages. More frequently, earthquake-triggered landslides cause harm by demolishing structures or
          disrupting bridges and other constructed structures.
      </p>
      <p>
          The rapid vertical movements of the seafloor due to fault ruptures during earthquakes can result in the formation of
          <i>tsunamis</i>,
          which are lengthy sea waves with extended periods. When in the open ocean, tsunamis cover vast distances at
          significant
          speeds, yet they are challenging to detect. Their usual height remains under 1 meter, while their wavelengths can
          span several
          hundred kilometers. However, as a tsunami nears the coastline, the reduction in water depth causes its speed to
          decrease and
          the wave's height to increase. In specific coastal regions, the seabed's configuration might amplify the wave,
          giving rise to an
          almost perpendicular wall of water that surges far inland, causing catastrophic devastation. When earthquakes
          generate waves
          in enclosed water bodies, these are referred to as <i>seiches</i>. Typically brought about by seismic waves with
          long periods that
          match the natural oscillation period of water within a lake or reservoir, seiches can manifest over extensive
          distances from
          the earthquake's source.
      </p>
    </>
  );
}
