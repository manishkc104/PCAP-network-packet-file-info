import sys
import json
from scapy.all import rdpcap
from io import BytesIO

def analyze_pcap(pcap_data):
    packets = rdpcap(BytesIO(pcap_data))
    result = []

    for packet in packets:
        try:
            proto = str(packet.proto)  # Try to access proto attribute
            len = str(packet.len)
        except AttributeError:
            proto = None  # Set proto to None if attribute is not available
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
    pcap_data = sys.stdin.buffer.read()  # Read PCAP data from stdin
    analysis_result = analyze_pcap(pcap_data)
    
    # Convert to JSON serializable format
    analysis_result_serializable = []
    for item in analysis_result:
        try:
            json.dumps(item)
            analysis_result_serializable.append(item)
        except TypeError:
            # If serialization fails, convert to string representation
            item['summary'] = str(item['summary'])
            analysis_result_serializable.append(item)
    
    # Serialize the serializable list to JSON
    print(json.dumps(analysis_result_serializable))
