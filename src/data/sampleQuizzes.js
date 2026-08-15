export const INITIAL_QUIZZES = [
  {
    id: "ccna-200-301-fundamental",
    title: "CCNA 200-301 Network Fundamentals & Routing",
    description: "Assess student core understanding of IP addressing, OSI layers, VLANs, subnetting, and Cisco router commands.",
    timeLimitMinutes: 15,
    passPercentage: 70,
    shuffleQuestions: true,
    shuffleOptions: true,
    allowReview: true,
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: "q1",
        question: "Which OSI model layer is responsible for translating data into a format that the application layer can accept, including encryption and compression?",
        codeSnippet: "",
        options: [
          "Layer 4 - Transport Layer",
          "Layer 5 - Session Layer",
          "Layer 6 - Presentation Layer",
          "Layer 7 - Application Layer"
        ],
        correctIndex: 2,
        explanation: "Layer 6 (Presentation Layer) handles data formatting, data conversion, encryption/decryption, and data compression.",
        category: "Network Fundamentals"
      },
      {
        id: "q2",
        question: "What is the usable host IP range for a subnet with network address 192.168.10.64/27?",
        codeSnippet: "Subnet: 192.168.10.64/27\nMask: 255.255.255.224",
        options: [
          "192.168.10.65 to 192.168.10.94",
          "192.168.10.64 to 192.168.10.95",
          "192.168.10.65 to 192.168.10.95",
          "192.168.10.66 to 192.168.10.96"
        ],
        correctIndex: 0,
        explanation: "A /27 subnet mask has a block size of 32 (256-224=32). Network is 192.168.10.64, Broadcast is 192.168.10.95. The usable host range is 192.168.10.65 - 192.168.10.94.",
        category: "Subnetting"
      },
      {
        id: "q3",
        question: "Which Cisco IOS command is used to configure a default static route pointing to next-hop IP 10.0.0.1?",
        codeSnippet: "",
        options: [
          "ip route 0.0.0.0 0.0.0.0 10.0.0.1",
          "ip static-route default 10.0.0.1",
          "router static default 10.0.0.1 0.0.0.0",
          "ip default-gateway 10.0.0.1"
        ],
        correctIndex: 0,
        explanation: "The syntax for a default static route is 'ip route 0.0.0.0 0.0.0.0 <next-hop-ip>'.",
        category: "IP Routing"
      },
      {
        id: "q4",
        question: "Which protocol operates at the Data Link Layer (Layer 2) to prevent switching loops in Ethernet networks?",
        codeSnippet: "",
        options: [
          "OSPF (Open Shortest Path First)",
          "STP (Spanning Tree Protocol)",
          "BGP (Border Gateway Protocol)",
          "VRRP (Virtual Router Redundancy Protocol)"
        ],
        correctIndex: 1,
        explanation: "STP (802.1D) prevents Layer 2 switching loops by placing redundant switch ports into a blocking state.",
        category: "Switching & VLANs"
      },
      {
        id: "q5",
        question: "An administrator executes the following command on a Cisco switch. What does this configuration do?",
        codeSnippet: "Switch(config-if)# switchport port-security mac-address sticky",
        options: [
          "It manually hardcodes a single static MAC address to the port.",
          "It dynamically learns MAC addresses and converts them into running configuration statements.",
          "It blocks all unknown MAC addresses permanently without saving to NVRAM.",
          "It disables port security when the port reboots."
        ],
        correctIndex: 1,
        explanation: "'sticky' MAC addressing allows the switch port to dynamically learn connected MAC addresses and add them to the running configuration.",
        category: "Network Security"
      },
      {
        id: "q6",
        question: "Which Administrative Distance (AD) value is assigned to an OSPF route by default on Cisco routers?",
        codeSnippet: "",
        options: [
          "90",
          "110",
          "120",
          "170"
        ],
        correctIndex: 1,
        explanation: "Default Administrative Distances: Connected=0, Static=1, EIGRP=90, OSPF=110, RIP=120, External EIGRP=170.",
        category: "IP Routing"
      },
      {
        id: "q7",
        question: "Which type of IPv6 address is equivalent to the IPv4 private address ranges (RFC 1918) and starts with fc00::/7?",
        codeSnippet: "",
        options: [
          "Global Unicast Address (GUA)",
          "Link-Local Address (LLA)",
          "Unique Local Address (ULA)",
          "Multicast Address"
        ],
        correctIndex: 2,
        explanation: "IPv6 Unique Local Addresses (ULA) fall in the FC00::/7 block (typically FD00::/8) and are non-routable on the global public Internet.",
        category: "IPv6"
      },
      {
        id: "q8",
        question: "What is the primary function of NAT (Network Address Translation) inside a enterprise router?",
        codeSnippet: "",
        options: [
          "To encrypt network traffic between remote offices.",
          "To translate private IP addresses into public IP addresses for Internet access.",
          "To automatically assign IP configuration parameters to client devices.",
          "To dynamically choose the shortest WAN path for voice traffic."
        ],
        correctIndex: 1,
        explanation: "NAT translates private (RFC 1918) IP addresses used on internal LANs into public IPv4 addresses for Internet communication.",
        category: "IP Services"
      }
    ]
  },
  {
    id: "general-it-networking-quiz",
    title: "General IT & Cybersecurity Foundations",
    description: "Practice questions covering basic networking protocols, port numbers, and core security practices.",
    timeLimitMinutes: 10,
    passPercentage: 75,
    shuffleQuestions: true,
    shuffleOptions: true,
    allowReview: true,
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: "g1",
        question: "Which transport protocol and port number does HTTPS (HTTP Secure) use by default?",
        codeSnippet: "",
        options: [
          "TCP port 80",
          "UDP port 443",
          "TCP port 443",
          "TCP port 22"
        ],
        correctIndex: 2,
        explanation: "HTTPS operates over TCP port 443 with TLS encryption.",
        category: "Protocols & Ports"
      },
      {
        id: "g2",
        question: "Which mechanism provides AAA (Authentication, Authorization, and Accounting) services in network access control?",
        codeSnippet: "",
        options: [
          "DNS & DHCP",
          "RADIUS & TACACS+",
          "SNMP & Syslog",
          "NTP & ICMP"
        ],
        correctIndex: 1,
        explanation: "RADIUS and TACACS+ are standard network AAA server protocols.",
        category: "Security"
      },
      {
        id: "g3",
        question: "What command line tool is used to display active TCP connections, listening ports, and routing tables on Windows and Linux?",
        codeSnippet: "",
        options: [
          "nslookup",
          "netstat",
          "tracert",
          "ipconfig /all"
        ],
        correctIndex: 1,
        explanation: "netstat displays active network sockets, connection states, and interface statistics.",
        category: "Troubleshooting Tools"
      }
    ]
  }
];
