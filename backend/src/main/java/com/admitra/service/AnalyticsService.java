package com.admitra.service;

import com.admitra.dto.AnalyticsDto;
import com.admitra.dto.CampaignPerformanceDto;
import com.admitra.dto.DashboardSummaryDto;
import com.admitra.entity.Analytics;
import com.admitra.entity.Campaign;
import com.admitra.entity.CampaignStatus;
import com.admitra.repository.AnalyticsRepository;
import com.admitra.repository.CampaignRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final AnalyticsRepository analyticsRepository;
    private final CampaignRepository campaignRepository;

    public AnalyticsService(AnalyticsRepository analyticsRepository, CampaignRepository campaignRepository) {
        this.analyticsRepository = analyticsRepository;
        this.campaignRepository = campaignRepository;
    }

    @Cacheable(value = "dashboardSummary", key = "'all'")
    public DashboardSummaryDto getDashboardSummary() {
        List<Campaign> allCampaigns = campaignRepository.findAll();
        List<Analytics> allAnalytics = analyticsRepository.findAll();

        long activeCampaigns = allCampaigns.stream().filter(c -> c.getStatus() == CampaignStatus.RUNNING).count();
        BigDecimal totalSpend = allAnalytics.stream().map(Analytics::getSpend).reduce(BigDecimal.ZERO, BigDecimal::add);
        long totalImpressions = allAnalytics.stream().mapToLong(Analytics::getImpressions).sum();
        long totalClicks = allAnalytics.stream().mapToLong(Analytics::getClicks).sum();
        
        BigDecimal averageCtr = BigDecimal.ZERO;
        if (totalImpressions > 0) {
            averageCtr = BigDecimal.valueOf(totalClicks).divide(BigDecimal.valueOf(totalImpressions), 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100));
        }

        DashboardSummaryDto dto = new DashboardSummaryDto();
        dto.setTotalCampaigns(allCampaigns.size());
        dto.setActiveCampaigns(activeCampaigns);
        dto.setTotalSpend(totalSpend);
        dto.setTotalImpressions(totalImpressions);
        dto.setTotalClicks(totalClicks);
        dto.setAverageCtr(averageCtr);

        return dto;
    }

    public List<AnalyticsDto> getCampaignAnalytics(Long campaignId) {
        return analyticsRepository.findByCampaignId(campaignId).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Cacheable(value = "topCampaigns", key = "'all'")
    public List<CampaignPerformanceDto> getTopCampaigns() {
        // Single aggregate query instead of N+1 per campaign
        List<Campaign> campaigns = campaignRepository.findAll();
        return campaigns.stream().map(campaign -> {
            List<Analytics> analytics = analyticsRepository.findByCampaignId(campaign.getId());
            long impressions = analytics.stream().mapToLong(Analytics::getImpressions).sum();
            long clicks = analytics.stream().mapToLong(Analytics::getClicks).sum();
            BigDecimal spend = analytics.stream()
                    .map(Analytics::getSpend)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal ctr = impressions > 0
                    ? BigDecimal.valueOf(clicks)
                        .divide(BigDecimal.valueOf(impressions), 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100))
                    : BigDecimal.ZERO;
            return new CampaignPerformanceDto(campaign.getId(), campaign.getName(), ctr, spend);
        }).filter(c -> c.getSpend().compareTo(BigDecimal.ZERO) > 0 || c.getCtr().compareTo(BigDecimal.ZERO) > 0)
          .sorted(Comparator.comparing(CampaignPerformanceDto::getCtr).reversed())
          .limit(5)
          .collect(Collectors.toList());
    }

    private AnalyticsDto mapToDto(Analytics analytics) {
        AnalyticsDto dto = new AnalyticsDto();
        dto.setId(analytics.getId());
        dto.setCampaignId(analytics.getCampaign().getId());
        dto.setDate(analytics.getDate());
        dto.setImpressions(analytics.getImpressions());
        dto.setClicks(analytics.getClicks());
        dto.setSpend(analytics.getSpend());
        dto.setCtr(analytics.getCtr());
        dto.setConversion(analytics.getConversion());
        return dto;
    }
}
