import QRCode from 'qrcode'
import { useEffect, useState } from 'react'

let initiate=true

export default function IDPQRCode() {
    const [qr, setQr] = useState(window.location.href)

    const GenerateQRCode = (text) => {
        QRCode.toDataURL(text, {
            width: 800,
            margin: 2,
            color: {
                 dark: '#335383FF',
                // light: '#EEEEEEFF'
            }
        }, (err, text) => {
            if (err) return console.error(err)
            setQr(text)
        })
    }

    useEffect(() => {
        GenerateQRCode(window.location.href)
    })
        
    return (
        <div className="app">
            {qr && <>
                <img src={qr} />
            </>}
        </div>
    )
}

