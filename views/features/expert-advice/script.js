// Expert Advice Data
const expertAdvice = [
    {
        title: "Sustainable Farming Practices",
        content: "Implementing crop rotation and intercropping can significantly improve soil health and reduce pest problems. Regular soil testing and organic matter addition are essential for maintaining soil fertility.",
        source: "Dr. Rajesh Kumar, Agricultural Scientist",
        sourceLink: "https://example.com/dr-rajesh-profile"
    },
    {
        title: "Water Management Techniques",
        content: "Drip irrigation and rainwater harvesting can help conserve water while maintaining crop productivity. Proper scheduling of irrigation based on crop growth stages is crucial for optimal water use.",
        source: "Water Management in Agriculture, 2023 Edition",
        sourceLink: "https://example.com/water-management-book"
    },
    {
        title: "Integrated Pest Management",
        content: "Combining biological control methods with minimal chemical intervention can effectively manage pests while reducing environmental impact. Regular monitoring and early detection are key to successful IPM.",
        source: "National Institute of Plant Health Management",
        sourceLink: "https://example.com/niphm-resources"
    },
    {
        title: "Climate-Smart Agriculture",
        content: "Adapting farming practices to changing climate conditions is essential. This includes selecting climate-resilient crop varieties and implementing conservation agriculture techniques.",
        source: "Climate Change and Agriculture Handbook",
        sourceLink: "https://example.com/climate-agriculture-handbook"
    },
    {
        title: "Organic Farming Methods",
        content: "Transitioning to organic farming requires careful planning and knowledge of organic inputs. Composting, green manuring, and biological pest control are fundamental practices.",
        source: "Organic Farming Association of India",
        sourceLink: "https://example.com/ofai-guidelines"
    }
];

// Initialize cards
document.addEventListener('DOMContentLoaded', () => {
    const adviceCards = document.getElementById('adviceCards');
    
    expertAdvice.forEach(advice => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4 mb-4';
        
        col.innerHTML = `
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${advice.title}</h5>
                    <p class="card-text">${advice.content}</p>
                </div>
                <div class="card-footer">
                    <small class="text-muted">
                        Source: <a href="${advice.sourceLink}" target="_blank">${advice.source}</a>
                    </small>
                </div>
            </div>
        `;
        
        adviceCards.appendChild(col);
    });
}); 