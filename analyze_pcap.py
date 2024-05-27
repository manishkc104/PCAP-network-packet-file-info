import sys
import json
from scapy.all import rdpcap
from io import BytesIO

def analyze_pcap(pcap_data):
    packets = rdpcap(BytesIO(pcap_data))
    result = []

    for packet in packets:
        try:
            proto = str(packet.proto)
            len = str(packet.len)
        except AttributeError:
            proto = None
            len  = None
        
        packet_info = {
            "Info": str(packet.summary()),  
            "Time": float(packet.time),  
            "Source": str(packet.src),
            "Destination": str(packet.dst),
            "Length": len,
            "Protocol": proto  
        }
        result.append(packet_info)
    
    return result


if __name__ == "__main__":
    pcap_data = sys.stdin.buffer.read()
    analysis_result = analyze_pcap(pcap_data)
    
    analysis_result_serializable = []
    for item in analysis_result:
        try:
            json.dumps(item)
            analysis_result_serializable.append(item)
        except TypeError:
            item['summary'] = str(item['summary'])
            analysis_result_serializable.append(item)
    
    print(json.dumps(analysis_result_serializable))
