import { Form, Input, Button,DatePicker } from 'antd';
import { layout, tailLayout } from './layouts';
import { useState } from 'react';
import { useAuth, useAuthUpdate } from '../../Components/AuthContext/AuthContext';
import { _markUserPositive } from '../../_helpers/endPoints';
import { validateEmail } from '../../_helpers/sharedFunctions';
import { logout } from '../../_helpers/sharedFunctions';
import moment from 'moment';
import {somethingWentWrongModal, confirmationSuccessModal} from './Modals';

const MarkCovidCase =(_) => {

    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const auth = useAuth();
    const updateAuth = useAuthUpdate();

    fetch('/api/healthprofessional/markpatientpositive')
        .then(res => console.log(res))

    const markCovidCase = (_, email) => {

        if(!validateEmail(email)) return Promise.resolve();

        let values = form.getFieldValue();
        let newValues = {};

        newValues.email = values.email;
        newValues.dateAdministered = new Date(values.dateAdministered._i);
        newValues.status = values.status;
        newValues.vaccinationType = values.vaccinationType;
        
       

        setLoading(true);
        return _markUserPositive(newValues, auth.token)
        .then(res => {
            setLoading(false);
            console.log(res);
            confirmationSuccessModal(email);
        })
        .catch(err => {
            setLoading(false);
            console.log(err);
            if(err.response.status === 400) return Promise.reject(new Error('Patient email not found in our system!'));
            else if(err.response.status === 401) logout(updateAuth);
            else somethingWentWrongModal();
        });
    }

    return(
        <div>
            <div style={{backgroundColor: "#FDC500"}}>
                <h1 style={{color: "#0E5F76", paddingLeft: "1%"}}>Mark person COVID Positive</h1>
            </div>
            

            
            <div>
                <h1 style={{marginTop:"5%" ,textAlign:'Center',fontWeight:'normal',color: "#0E5F76"}}>
                    <span >Mark a patient as positive with</span>
                    <br/>
                    <span >COVID-19 for contact Tracing</span> 
                </h1>
            </div>

            <Form 
            form={form}
            {...layout}
            >

                <Form.Item
                        label="Patient Email"
                        name="email"
                        style={{color: "#0E5F76"}}
                        validateTrigger={['onBlur']}
                        rules={[
                            {   
                                type: 'email',
                                required: true,
                                message: 'Email does not appear to be valid!',
                                whitespace: true,
                            },
                            {
                                validator: markCovidCase,
                                validateTrigger: "onSubmit"
                            }
                        ]}
                    >
                        <Input maxLength={50}/>
                    </Form.Item>

                <Form.Item
                        {...layout}
                        label="positive test date"
                        name="dateAdministered"
                        rules={[
                            {
                                required: true,
                                message: "Please select date patient was tested positive!"
                            }
                        ]}
                    >
                        <DatePicker disabledDate={current => { return current && current > moment().endOf('day')}}/>
                    </Form.Item>

                   {/*} <Form.Item
                        {...layout}
                        label=" infectious start date"
                        name="dateAdministered2"
                        rules={[
                            {
                                required: true,
                                message: "Please select date infectious start!"
                            }
                        ]}
                    >
                        <DatePicker disabledDate={current => { return current && current > moment().endOf('day')}}/>
                    </Form.Item>*/}

                <Form.Item {...tailLayout}>
                    <Button loading={loading} type="primary" htmlType="submit">Mark individual as positive</Button>
                    
                </Form.Item>

            </Form>

        </div>
    );
}

export default MarkCovidCase;