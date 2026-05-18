<style>{`
  .sidebar-container {
    width: 260px;
    border-right: 1px solid #eaeaea;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    background-color: #f9f9f9;
  }

  /* 📱 When viewed on a mobile device, reshape the sidebar into a compact top nav banner */
  @media (max-width: 768px) {
    .sidebar-container {
      width: 100%;
      height: auto;
      border-right: none;
      border-bottom: 1px solid #eaeaea;
      padding: 0.75rem 1rem;
      flex-direction: row; /* Layout items side-by-side on mobile */
      align-items: center;
      justify-content: space-between;
    }
    
    /* Optional: Hide less important sidebar text links on mobile to keep it from looking cluttered */
    .sidebar-container a span {
      font-size: 0.85rem;
    }
  }
`}</style>