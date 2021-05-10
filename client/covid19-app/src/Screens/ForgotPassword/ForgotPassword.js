import { layout, tailLayout } from './Layouts';
import { Form, Button, Input, Radio } from 'antd';
//import { _forgotPasswordGeneral } from '../../_helpers/endPoints'; 
import USER_TYPE from '../../_constants/userTypes';




const ForgotPassword = () => {
    return (
        <div>
            <div style={{backgroundColor: "#FDC500"}}>
                <h1 style={{color: "#0E5F76", paddingLeft: "1%"}}>Forgot Password</h1>
            </div>

            <div style={{textAlign: 'center', padding: '1%'}}>
                <h1 style={{color: "#0E5F76"}}>Forgot Password?</h1>
            </div>

            <div>
                <Form {...layout}>
                    <Form.Item
                        label="Email"
                        name="email"
                        style={{color: "#0E5F76"}}
                        rules={[
                        {   
                            type: 'email',
                            required: true,
                            message: 'Please input valid email!',
                            whitespace: true,
                            validateTrigger: 'onSubmit'
                        },
                        ]}
                    >
                        <Input placeholder="Enter your email here" maxLength={50}/>
                    </Form.Item>

                    <Form.Item 
                        {...layout} 
                        name="type" 
                        label="User type"
                        rules={[{ required: true }]}
                    >
                        <Radio.Group>
                            <Radio value={USER_TYPE.GENERAL}>General Public</Radio>
                            <Radio value={USER_TYPE.HEALTH}>Health Professional</Radio>
                            <Radio value={USER_TYPE.BUSINESS}>Venue Owner</Radio>
                        </Radio.Group>
                    </Form.Item>
            
                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">Submit</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default ForgotPassword;