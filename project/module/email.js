const joinMailOptions = (email, pin) => {
    return {
      from: process.env.EMAIL_ACCOUNT,
      to: email,
      subject: `${process.env.SITE_NAME}에서 전송한 인증메일입니다.`,
      html: `
    <!DOCTYPE html>
    <html>
    <head><title> 인증메일 </title></head>
    <body style="background-color:#fff; padding-top: 20px;">
      <div>
        <h1>
          <a href="https://www.${process.env.SITE_URL}.chat" target="_blank">
            <img src="https://d3pymq0cbjc18t.cloudfront.net/meta/logo_${process.env.MODE}.png" style="width:100px;" />
          </a>
        </h1>
        <p style="font-size: 20px; font-weight: 700">
          안녕하세요, ${process.env.SITE_NAME}에 오신 것을 환영합니다.
        </p>
        <a href="https://www.${process.env.SITE_URL}.chat/auth?userId=${email}&pin=${pin}"
           style="color:#2269CC; text-decoration: none; border-bottom: 1px solid #2269CC; font-weight: 700">
          인증하기
        </a>
        <p style="font-size: 16px; color: #505050;">
          본 메일은 이메일 인증을 위한 메일입니다.<br/>
          문의사항은 ${process.env.EMAIL_ACCOUNT} 으로 연락주세요.
        </p>
      </div>
    </body>
    </html>
    `,
    }
  }
  
  const resetPwOptions = (email, pin) => {
    return {
      from: process.env.EMAIL_ACCOUNT,
      to: email,
      subject: `${process.env.SITE_NAME} 비밀번호 재설정 요청`,
      html: `
    <!DOCTYPE html>
    <html>
    <head><title> 비밀번호 재설정 </title></head>
    <body style="background-color:#fff; padding-top: 20px;">
      <div>
        <h2>비밀번호 재설정 인증 코드</h2>
        <p><strong>${pin}</strong></p>
        <p>위 코드를 입력해 비밀번호 재설정을 완료해 주세요.</p>
        <p style="font-size: 14px; color: gray;">
          본 메일은 비밀번호 변경 요청에 따라 발송되었습니다.<br/>
          요청하지 않으셨다면 ${process.env.EMAIL_ACCOUNT} 으로 연락 주세요.
        </p>
      </div>
    </body>
    </html>
    `,
    }
  }
  
  module.exports = {
    joinMailOptions,
    resetPwOptions,
  }