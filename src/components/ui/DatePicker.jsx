import { DatePicker } from "antd";
import {} from "moment";
import momentGenerateConfig from "rc-picker/lib/generate/moment";

const MyDatePicker = DatePicker.generatePicker(momentGenerateConfig);

export default MyDatePicker;
