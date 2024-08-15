/* eslint-disable @typescript-eslint/no-explicit-any */
class PeerService {
  peer: RTCPeerConnection | null = null;

  constructor() {
      if (!this.peer) {
          this.peer = new RTCPeerConnection({
              iceServers: [
                  {
                      urls: [
                          "stun:stun.l.google.com:19302",
                          "stun:global.stun.twilio.com:3478",
                      ],
                  },
              ],
          });
      }
  }

  async getAnswer(offer: RTCSessionDescriptionInit) {
      if (this.peer) {
          // Set the remote description with the offer received from the remote peer
          await this.peer.setRemoteDescription(offer);
          
          // Create an answer to that offer
          const answer = await this.peer.createAnswer();
          
          // Set the local description with the answer
          await this.peer.setLocalDescription(new RTCSessionDescription(answer));
          
          // Return the answer to be sent back to the remote peer
          return answer;
      }
  }

  async setRemoteAnswer(answer: RTCSessionDescriptionInit) {
      if (this.peer) {
          // Set the remote description with the answer received from the remote peer
          await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
      }
  }

  async getOffer() {
      if (this.peer) {
          // Create an offer for the remote peer
          const offer = await this.peer.createOffer();
          
          // Set the local description with the offer
          await this.peer.setLocalDescription(new RTCSessionDescription(offer));
          
          // Return the offer to be sent to the remote peer
          return offer;
      }
  }
}

export default new PeerService();
