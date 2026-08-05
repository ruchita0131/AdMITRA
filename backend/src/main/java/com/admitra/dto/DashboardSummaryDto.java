package com.admitra.dto;

import java.math.BigDecimal;

public class DashboardSummaryDto {
    private long totalCampaigns;
    private long activeCampaigns;
    private BigDecimal totalSpend;
    private long totalImpressions;
    private long totalClicks;
    private BigDecimal averageCtr;

    public long getTotalCampaigns() { return totalCampaigns; }
    public void setTotalCampaigns(long totalCampaigns) { this.totalCampaigns = totalCampaigns; }
    public long getActiveCampaigns() { return activeCampaigns; }
    public void setActiveCampaigns(long activeCampaigns) { this.activeCampaigns = activeCampaigns; }
    public BigDecimal getTotalSpend() { return totalSpend; }
    public void setTotalSpend(BigDecimal totalSpend) { this.totalSpend = totalSpend; }
    public long getTotalImpressions() { return totalImpressions; }
    public void setTotalImpressions(long totalImpressions) { this.totalImpressions = totalImpressions; }
    public long getTotalClicks() { return totalClicks; }
    public void setTotalClicks(long totalClicks) { this.totalClicks = totalClicks; }
    public BigDecimal getAverageCtr() { return averageCtr; }
    public void setAverageCtr(BigDecimal averageCtr) { this.averageCtr = averageCtr; }
}
