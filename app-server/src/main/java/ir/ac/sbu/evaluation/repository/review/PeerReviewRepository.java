package ir.ac.sbu.evaluation.repository.review;

import ir.ac.sbu.evaluation.model.review.PeerReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PeerReviewRepository extends JpaRepository<PeerReview, Long> {

}