"use client"

import Script from "next/script"
import { useEffect, useState, useCallback } from "react"
import { ArrowRightFromLine, Copy, Check, ChevronRight } from "lucide-react"
import { FadeInSection } from "@/utils/fadeInSection"
import axios from "axios"

export default function Checkpoint() {
  const [continueIcon, setContinueIcon] = useState(false)
  const [checkIcon, setCheckIcon] = useState(false)
  const [captcha, setCaptchaIcon] = useState(true)
  const [button, setButton] = useState(true)
  const [completedCaptcha, setCompletedCaptcha] = useState(false)
  const [link, setLink] = useState("")

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const hash = searchParams.get("eruVpen")
    const hash2 = searchParams.get("auroVepBe")
    const localstorage = localStorage

    setTimeout(() => {
      const container = document.getElementById("hcaptcha-container");
      if (!container) return;
      const captcha = document.createElement("div");
      captcha.id = "hcaptcha-widget";
      container.appendChild(captcha);
      window.hcaptcha.render("hcaptcha-widget", {
        sitekey: "7c404cc6-eef8-438c-ae44-442649bc36fe",
        callback: function(token) {
          if (token && token.length > 1295) {
            setCompletedCaptcha(true)
            setContinueIcon(true)
            const proceedTextElement = document.getElementById("Proceed-Text")
            if (proceedTextElement) proceedTextElement.textContent = "Continue"
          }
        }
      });
    }, 1000);
    
    let special_key = parseInt(localstorage.getItem("seiVi"))
    let decryption_key = parseInt(localstorage.getItem("bfvgiO_kPe"))
    let selected_duration = parseInt(localstorage.getItem("vKoeldnIw"))
    let hwid = localstorage.getItem("JdokSbox")
    const whitelist_duration = [
        {
            Text: "6 Hours",
            Checkpoints: 1,
            Unix: 21600
        },
        {
            Text: "12 Hours",
            Checkpoints: 2,
            Unix: 43200
        },
        {
            Text: "1 Day",
            Checkpoints: 3,
            Unix: 86400
        },
        {
            Text: "3 Days",
            Checkpoints: 5,
            Unix: 259200
        },
        {
            Text: "5 Days",
            Checkpoints: 8,
            Unix: 432000
        },
        {
            Text: "7 Days",
            Checkpoints: 10,
            Unix: 604800
        }
    ]
    let unix
    let total_checkpoints

    function hexEncode(str) {
      return [...str].map(c => {
        return (c.charCodeAt(0) * 2).toString(16).padStart(2, "0")
      }).join("");
    }
    
    function hexDecode(hexStr) {
      return hexStr.match(/.{1,2}/g).map(byte => String.fromCharCode(parseInt(byte, 16) / 2)).join("");
    }

    if (!hwid || hwid == "" || !parseInt(hexDecode(hwid))) {
        window.location.href = "/whitelist/selections"
        return
    }

    if (selected_duration) {
        const ok = whitelist_duration[selected_duration - 1]
        if (ok) {
            unix = ok.Unix
            total_checkpoints = ok.Checkpoints
            document.getElementById("key-duration").textContent = ok.Text
            document.getElementById("total_checkpoints").textContent = ok.Checkpoints
        } else {
            window.location.href = "/whitelist/selections"
            return
        }
    } else {
        window.location.href = "/whitelist/selections"
        return
    }

    const last_hash = localstorage.getItem("ehcopahskdnHe")
    if (hash && hash !== "" && hash !== last_hash) {
        try {
            const hash_now = hexDecode(hash)
            const hash2_now = parseInt(hexDecode(hexDecode(hash2)))
            if (hash_now && hash2_now && (Math.floor(Date.now() / 1000) - hash2_now) < 30 && hash_now.length > 25) {
               localstorage.setItem("ehcopahskdnHe", hash)
               localstorage.setItem("hdocnoOe", ((parseInt(((parseInt(localstorage.getItem("hdocnoOe")) || 0) / special_key) / special_key) + 1) * special_key) * special_key)
               localstorage.removeItem("ayinEuov")
               window.location.href = "/whitelist/checkpoint"
               return
            } else {
               localstorage.setItem("ayinEuov", Math.floor(Date.now() / 1000) + 1800)
            }
        } catch {
           localstorage.setItem("ayinEuov", Math.floor(Date.now() / 1000) + 1800)
        }
    }

    const authentication = async () => {
      try {
        const response = await axios.post("https://api.overdrivehub.xyz/v1/whitelist/" + hexEncode(Math.floor(Date.now() / 1000) + " " + hwid + " " + unix))
        if (response.data.status == 200) {
          localstorage.removeItem("hdocnoOe")
          localstorage.removeItem("ayinEuov")
          window.location.href = "/whitelist/checkpoint"
          return
        }
      } catch {}
      await authentication()
    };

    const main = async () => {
      const response = await axios.get("https://api.overdrivehub.xyz/v1/whitelist/" + hwid)
      if (response.data.valid) {
        setButton(false)
        setCaptchaIcon(false)
        document.getElementById("hodpjm").innerHTML = "<b>You have been authenticated!</b>"
        const desc = document.getElementById("description")
        const Unix = response.data.unix
        const MathFloor = Math.floor
        const DateNow = Date.now
        const timer = () => {
            const TimeLeft = Unix - MathFloor(DateNow() / 1000)
            let day = 0
            let hour = MathFloor(TimeLeft / 3600)
            while (hour >= 24) {
                hour = hour - 24
                day = day + 1
            }
            desc.textContent = day + " : " + hour + " : " + MathFloor((TimeLeft % 3600) / 60) + " : " + (TimeLeft % 60)
            if (TimeLeft < 0) {
                window.location.href = "/whitelist/checkpoint"
            }
        }
        timer()
        setInterval(timer, 500)
      } else {
        const Unix = parseInt(localstorage.getItem("ayinEuov"))
        if (Unix) {
          setButton(false)
        setCaptchaIcon(false)
        document.getElementById("hodpjm").innerHTML = "<b style=\"color: red;\">You have been temporarily banned from doing the key system for bypassing the checkpoint!</b>"
        const desc = document.getElementById("description")
        const MathFloor = Math.floor
        const DateNow = Date.now
        const timer = () => {
            const TimeLeft = Unix - MathFloor(DateNow() / 1000)
            let day = 0
            let hour = MathFloor(TimeLeft / 3600)
            while (hour >= 24) {
                hour = hour - 24
                day = day + 1
            }
            desc.innerHTML = day + " : " + hour + " : " + MathFloor((TimeLeft % 3600) / 60) + " : " + (TimeLeft % 60)
            if (TimeLeft < 0) {
                localstorage.removeItem("ayinEuov")
                window.location.href = "/whitelist/checkpoint"
            }
        }
        timer()
        setInterval(timer, 500)
          return
        }
        if (!special_key || !decryption_key) {
            special_key = parseInt(Math.random() * 9999999)
            localstorage.setItem("seiVi", special_key)
            localstorage.setItem("bfvgiO_kPe", (64000 * special_key) * special_key)
            window.location.href = "/whitelist/checkpoint"
            return
        } else {
            if (((decryption_key / special_key) / special_key) == 64000) {
                let current_checkpoint = parseInt(localstorage.getItem("hdocnoOe"))
                if (!current_checkpoint) {
                    current_checkpoint = 0
                    localstorage.setItem("hdocnoOe", (3 * special_key) * special_key)
                } else {
                    current_checkpoint = ((current_checkpoint / special_key) / special_key) - 3
                }
                if (current_checkpoint > total_checkpoints || current_checkpoint < 0) {
                    localstorage.removeItem("hdocnoOe")
                    window.location.href = "/whitelist/checkpoint"
                    return
                } else {
                    document.getElementById("completed_checkpoints").textContent = current_checkpoint.toString()
                    if (current_checkpoint == total_checkpoints) {
                        setButton(false)
                        setCaptchaIcon(false)
                        document.getElementById("description").textContent = "Authenticating..."
                        await authentication()
                    } else if (current_checkpoint == 0) {
                        setLink("https://link-hub.net/978899/overdrive-h-key-system")
                    } else if (current_checkpoint == 1) {
                        setLink("https://link-hub.net/978899/overdrive-h-checkpoint-2")
                    } else if (current_checkpoint == 2) {
                        setLink("https://direct-link.net/978899/overdrive-h-checkpoint-3")
                    } else if (current_checkpoint == 3) {
                        setLink("https://direct-link.net/978899/overdrive-h-checkpoint-4")
                    } else if (current_checkpoint == 4) {
                        setLink("https://direct-link.net/978899/overdrive-h-checkpoint-5")
                    } else if (current_checkpoint == 5) {
                        setLink("https://direct-link.net/978899/overdrive-h-checkpoint-6")
                    } else if (current_checkpoint == 6) {
                        setLink("https://direct-link.net/978899/overdrive-h-checkpoint-7")
                    } else if (current_checkpoint == 7) {
                        setLink("https://direct-link.net/978899/overdrive-h-checkpoint-8")
                    } else if (current_checkpoint == 8) {
                        setLink("https://direct-link.net/978899/overdrive-h-checkpoint-9")
                    } else if (current_checkpoint == 9) {
                        setLink("https://direct-link.net/978899/overdrive-h-checkpoint-10")
                    }
                }
            } else {
                special_key = parseInt(Math.random() * 9999999)
                localstorage.setItem("seiVi", special_key)
                localstorage.setItem("bfvgiO_kPe", (64000 * special_key) * special_key)
                window.location.href = "/whitelist/checkpoint"
                return
            }
        }
      }
    }
    main()
 }, [])
 
  const handleProceedClick = useCallback(() => {
      if (completedCaptcha && link) {
          window.location.href = link
      }
  }, [completedCaptcha])

  return (
    <> <FadeInSection>
      <Script src="https://js.hcaptcha.com/1/api.js" async defer></Script>

      <div className="min-h-screen flex items-center justify-center bg-black/50">
        <div className="max-w-md w-full bg-transparent border-2 rounded-lg transition-all duration-300 ease-in-out scale-90 transform hover:border-blue-500 hover:scale-100 border-2 border-transparent text-white">
          <br />
          <h1 className="text-2xl font-bold text-center mb-4">Whitelist System</h1>
          <div className="mb-6 text-center">
            <p id="hodpjm">
              Completed <b id="completed_checkpoints">0</b> out of <b id="total_checkpoints">3</b>
              <br />
              Whitelist Duration: <b id="key-duration">0 Hours</b>
            </p>
            <br />
            <p id="description">
              Click '<b>Continue</b>' in order to proceed to the next checkpoint.
            </p>
          </div>
          {captcha && (
              <div className="flex justify-center">
                  <div id="hcaptcha-container"></div>
              </div>
          )}
          {button &&
          <div className="flex justify-center">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all duration-300 ease-in-out transform hover:scale-105"
              id="Proceed"
              onClick={handleProceedClick}
            >
              <span className="flex items-center space-x-1">
                {checkIcon && <Check className="h-6 w-6" />}
                <p id="Proceed-Text">Please complete the captcha first!</p>
                {continueIcon && <ArrowRightFromLine className="h-6 w-6 ml-auto" />}
              </span>
            </button>
          </div>}
          <br />
          <div className="mb-6 text-center">
            <p>
              Thank you for using <b>Overdrive H</b>
            </p>
          </div>
        </div>
      </div> </FadeInSection>
    </>
  )
}