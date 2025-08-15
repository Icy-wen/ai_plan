import React, { useEffect, useState } from 'react';
import { Cell, CellGroup, Avatar } from 'tdesign-mobile-react';
import { ChartComboIcon, Setting1Icon, UserIcon ,Edit2Icon} from 'tdesign-icons-react';
import style from './index.module.less'
import { useNavigate } from 'react-router-dom';
export default function Single() {
    const [userInfo, setUserInfo] = useState(null);
    const navigate=useNavigate()
    useEffect(() => {
        // 从localStorage获取用户信息
        const user = localStorage.getItem('user');
        if (user) {
            setUserInfo(JSON.parse(user));
        }
    }, []);

    return (
        <div className={style.profile}>
            <div className={style.message}>
                <div className={style.avatar}>
                    <div className={style['avatar-demo']}>
                        <Avatar className={style['avatar-example--large']} shape="circle" size="3rem" icon={<UserIcon size="2rem"/>} />
                    </div>
                     <Edit2Icon size='0.7rem' style={{position:'absolute',top:'2rem',left:'2.3rem'}} onClick={()=>{
                        navigate('/editifo')
                     }}/>
                </div>
                <div className={style.nickname}>
                    <p>{userInfo?.nickname || '未设置昵称'}</p>
                </div>

            </div>
            <div className={style.other}>
                <div className={style['tdesign-grid-base']}>
                    <CellGroup bordered>
                        <Cell title="周报" arrow hover leftIcon={<ChartComboIcon />} onClick={()=>{
                            navigate('/summary')
                        }}/>
                        <Cell title="设置" arrow hover leftIcon={<Setting1Icon />} onClick={()=>{
                            navigate('/setting')
                        }}/>
                    </CellGroup>
                </div>
            </div>
        </div>
    );
}
