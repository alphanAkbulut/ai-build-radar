# Mobile use

**Status:** implementation plus a dated 5 October 2026 browser check. [Türkçe](MOBILE.md).

At widths of 850 CSS pixels or less, navigation uses a menu that closes after selecting a page or pressing Escape. Collection and lesson layouts become one column; tables scroll inside their own region. Inputs use 16-pixel text and important controls target at least 44 pixels.

In the dated browser check, 320/390-pixel collection and people pages, 390-pixel lesson/source pages, and a 767-pixel tablet collection did not overflow horizontally. Menu navigation and opening/closing a live demo were exercised; the production build passed. A physical-phone check remains unverified.

`Start-Radar-Mobile.command` starts the built app at the Mac's private LAN IPv4 on port `3102` and prints the address. Open it from a phone on the same Wi-Fi with the local password in `LOCAL-ACCESS.txt`. The Mac, app, and network must remain active. VPN, guest-network isolation, or the firewall may block access. This is local HTTP, not HTTPS or internet deployment. The normal `127.0.0.1:3101` desktop app remains separate, and this launcher does not start a second ingestion worker. If no private IP is found, it stops rather than binding all interfaces. The dated LAN check returned a login redirect for `/people` and a successful `/login` response.
