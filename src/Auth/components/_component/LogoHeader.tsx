import Ros from '../../../assets/images/ROS_FINAL-07.png';
import final from '../../../assets/images/ROS_FINAL-05.png';

function LogoHeader() {
    return (
      <div className="text-center">
      <div className="flex items-center justify-center text-center ">
    <span className="text-2xl font-bold text-center">Welcome to</span>
    <img src={Ros} alt="ROS Logo" width={100} height={29} className="object-contain" />
  </div>
  
        <img src={final} alt="ROS Logo" width={270} height={230} className="" />
      </div>
    );
  }

  export default LogoHeader;