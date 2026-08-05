package com.admitra.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class AnalyticsDto {
    private Long id;
    private Long campaignId;
    private LocalDate date;
    private long impressions;
    private long clicks;
    private BigDecimal spend;
    private BigDecimal ctr;
    private BigDecimal conversion;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getCampaignId() { return campaignId; }
    public void setCampaignId(Long campaignId) { this.campaignId = campaignId; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public long getImpressions() { return impressions; }
    public void setImpressions(long impressions) { this.impressions = impressions; }
    public long getClicks() { return clicks; }
    public void setClicks(long clicks) { this.clicks = clicks; }
    public BigDecimal getSpend() { return spend; }
    public void setSpend(BigDecimal spend) { this.spend = spend; }
    public BigDecimal getCtr() { return ctr; }
    public void setCtr(BigDecimal ctr) { this.ctr = ctr; }
    public BigDecimal getConversion() { return conversion; }
    public void setConversion(BigDecimal conversion) { this.conversion = conversion; }
}
